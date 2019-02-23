import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent, CardActions, Typography,
  Button, TextField,
} from '@material-ui/core'
import DomainIcon from '@material-ui/icons/Domain'
import {
  BEPTable,
} from 'components/table/index'
import {
  Company as CompanyEntity,
  RecordHandler as CompanyRecordHandler,
} from 'brain/party/company/index'
import {FullPageLoader} from 'components/loader/index'
import {ReasonsInvalid} from 'brain/validate/index'
import {Text} from 'brain/search/criterion/types'
import {Query} from 'brain/search/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import LoginClaims from 'brain/security/auth/claims/LoginClaims'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
  detailCard: {},
  companyIcon: {
    fontSize: 100,
    color: theme.palette.primary.main,
  },
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  init: states.nop,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.nop,
  cancelEditExisting: states.nop,
}

class Company extends Component {

  state = {
    recordCollectionInProgress: false,
    isLoading: false,
    activeState: events.init,
    selected: new CompanyEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
  }

  reasonsInvalid = new ReasonsInvalid()

  collectCriteria = []
  collectQuery = new Query()

  constructor(props) {
    super(props)
    this.renderControls = this.renderControls.bind(this)
    this.renderCompanyDetails = this.renderCompanyDetails.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInviteAdmin = this.handleInviteAdmin.bind(this)
    this.handleCreateNew = this.handleCreateNew.bind(this)
    this.handleCancelCreateNew = this.handleCancelCreateNew.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleStartEditExisting = this.handleStartEditExisting.bind(this)
    this.handleCancelEditExisting = this.handleCancelEditExisting.bind(this)
    this.collectTimeout = () => {
    }
  }

  componentDidMount() {
    this.collect()
  }

  handleCreateNew() {
    const {
      claims,
    } = this.props
    let newCompanyEntity = new CompanyEntity()
    newCompanyEntity.parentId = claims.partyId
    newCompanyEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      selected: newCompanyEntity,
    })
  }

  handleFieldChange(event) {
    let {
      selected,
    } = this.state
    selected[event.target.id] = event.target.value
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({selected})
  }

  async handleSaveNew() {
    const {
      selected,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    this.setState({isLoading: true})

    // perform validation
    try {
      const reasonsInvalid = await selected.validate('Create')
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        this.setState({isLoading: false})
        return
      }
    } catch (e) {
      console.error('Error Validating Company', e)
      NotificationFailure('Error Validating Company')
      this.setState({isLoading: false})
      return
    }

    // if validation passes, perform create
    try {
      await selected.create()
      NotificationSuccess('Successfully Created Company')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
      this.setState({isLoading: false})
    } catch (e) {
      console.error('Error Creating Company', e)
      NotificationFailure('Error Creating Company')
      this.setState({isLoading: false})
    }
  }

  handleCancelCreateNew() {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  handleSaveChanges() {
    this.setState({activeState: events.finishEditExisting})
  }

  handleStartEditExisting() {
    this.setState({
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting() {
    this.setState({activeState: events.finishEditExisting})
  }

  collect() {
    const {
      NotificationFailure,
    } = this.props

    this.setState({recordCollectionInProgress: true})
    CompanyRecordHandler.Collect(this.collectCriteria, this.collectQuery)
        .then(response => {
          this.setState({
            records: response.records,
            totalNoRecords: response.total,
          })
        })
        .catch(error => {
          console.error(`error collecting records: ${error}`)
          NotificationFailure('Failed To Fetch Companies')
        })
        .finally(() => {
          this.setState({recordCollectionInProgress: false})
        })
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      selected: new CompanyEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: rowIdx,
      selected: new CompanyEntity(rowRecordObj),
      activeState: events.selectExisting,
    })
  }

  handleInviteAdmin() {
    const {
      selected,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    this.setState({isLoading: true})
    PartyRegistrar.InviteCompanyAdminUser(selected.identifier).then(() => {
      NotificationSuccess('Successfully Invited Company Admin User')
    }).catch(error => {
      console.error('Failed to Invite Company Admin User', error)
      NotificationFailure('Failed to Invite Company Admin User')
    }).finally(() => {
      this.setState({isLoading: false})
    })
  }

  render() {
    const {
      isLoading,
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
    } = this.state
    const {
      theme,
      classes,
    } = this.props

    return <Grid
        container
        direction='column'
        spacing={8}
        alignItems='center'
    >
      <Grid item xl={12}>
        <Grid container>
          <Grid item>
            <Card className={classes.detailCard}>
              <CardContent>
                {this.renderCompanyDetails()}
              </CardContent>
              {this.renderControls()}
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xl={12}>
        <Card>
          <CardContent>
            <BEPTable
                loading={recordCollectionInProgress}
                totalNoRecords={totalNoRecords}
                noDataText={'No Companies Found'}
                data={records}
                onCriteriaQueryChange={this.handleCriteriaQueryChange}

                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name',
                    config: {
                      filter: {
                        type: Text,
                      },
                    },
                  },
                  {
                    Header: 'Admin Email',
                    accessor: 'adminEmailAddress',
                    config: {
                      filter: {
                        type: Text,
                      },
                    },
                  },
                ]}

                getTdProps={(state, rowInfo) => {
                  const rowIndex = rowInfo ? rowInfo.index : undefined
                  return {
                    onClick: (e, handleOriginal) => {
                      if (rowInfo) {
                        this.handleSelect(rowInfo.original, rowInfo.index)
                      }
                      if (handleOriginal) {
                        handleOriginal()
                      }
                    },
                    style: {
                      background: rowIndex === selectedRowIdx ?
                          theme.palette.secondary.light :
                          'white',
                      color: rowIndex === selectedRowIdx ?
                          theme.palette.secondary.contrastText :
                          theme.palette.primary.main,
                    },
                  }
                }}
            />
          </CardContent>
        </Card>
      </Grid>
      <FullPageLoader open={isLoading}/>
    </Grid>
  }

  renderCompanyDetails() {
    const {
      isLoading,
      activeState,
    } = this.state
    const {
      classes,
    } = this.props

    const fieldValidations = this.reasonsInvalid.toMap()
    const disableFields = (activeState === states.viewingExisting) ||
        isLoading

    switch (activeState) {

      case states.nop:
        return <Grid
            container
            direction='column'
            spacing={8}
            alignItems={'center'}
        >
          <Grid item>
            <Typography
                variant={'body1'}
                align={'center'}
                color={'primary'}
            >
              Select A Company to View or Edit
            </Typography>
          </Grid>
          <Grid item>
            <DomainIcon className={classes.companyIcon}/>
          </Grid>
          <Grid item>
            <Button
                size='small'
                color='primary'
                variant='contained'
                onClick={this.handleCreateNew}
            >
              Create New
            </Button>
          </Grid>
        </Grid>

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {
          selected,
        } = this.state
        return <Grid
            container
            direction='column'
            spacing={8}
            alignItems={'center'}
        >
          <Grid item>
            <Typography
                variant={'body1'}
                align={'center'}
                color={'primary'}
            >
              {(() => {
                switch (activeState) {
                  case states.editingNew:
                    return 'Creating New'
                  case states.editingExisting:
                    return 'Editing'
                  case states.viewingExisting:
                    return 'Details'
                  default:
                }
              })()}
            </Typography>
          </Grid>
          <Grid item>
            <TextField
                className={classes.formField}
                id='name'
                label='Name'
                value={selected.name}
                onChange={this.handleFieldChange}
                disabled={disableFields}
                helperText={
                  fieldValidations.name
                      ? fieldValidations.name.help
                      : undefined
                }
                error={!!fieldValidations.name}
            />
          </Grid>
          <Grid item>
            <TextField
                className={classes.formField}
                id='adminEmailAddress'
                label='Admin Email'
                value={selected.adminEmailAddress}
                onChange={this.handleFieldChange}
                disabled={disableFields}
                helperText={
                  fieldValidations.adminEmailAddress
                      ? fieldValidations.adminEmailAddress.help
                      : undefined
                }
                error={!!fieldValidations.adminEmailAddress}
            />
          </Grid>
        </Grid>

      default:
    }

  }

  renderControls() {
    const {
      activeState,
    } = this.state

    switch (activeState) {

      case states.viewingExisting:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleStartEditExisting}
          >
            Edit
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleInviteAdmin}
          >
            Invite Admin
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleCreateNew}
          >
            Create New
          </Button>
        </CardActions>

      case states.editingNew:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleSaveNew}
          >
            Save New
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleCancelCreateNew}
          >
            Cancel
          </Button>
        </CardActions>

      case states.editingExisting:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleSaveChanges}
          >
            Save Changes
          </Button>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleCancelEditExisting}
          >
            Cancel
          </Button>
        </CardActions>

      case states.nop:
      default:
    }
  }
}

Company = withStyles(styles, {withTheme: true})(Company)

Company.propTypes = {
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(LoginClaims),
}

Company.defaultProps = {}

export default Company