import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent, CardActions, Typography,
  Button, TextField,
} from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/People'
import {
  BEPTable,
} from 'components/table/index'
import {
  Client as ClientEntity,
  ClientRecordHandler,
} from 'brain/party/client/index'
import {FullPageLoader} from 'components/loader/index'
import {ReasonsInvalid} from 'brain/validate/index'
import {Text} from 'brain/search/criterion/types'
import {Query} from 'brain/search/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import {LoginClaims} from 'brain/security/claims'
import {User as UserEntity} from 'brain/party/user/index'
import {
  Client as ClientPartyType,
} from 'brain/party/types'
import IdIdentifier from 'brain/search/identifier/Id'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
  detailCard: {},
  clientIcon: {
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
}

class Client extends Component {

  state = {
    recordCollectionInProgress: false,
    isLoading: false,
    activeState: events.init,
    selected: new ClientEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
  }

  reasonsInvalid = new ReasonsInvalid()
  clientRegistration = {}

  collectCriteria = []
  collectQuery = new Query()

  constructor(props) {
    super(props)
    this.renderControls = this.renderControls.bind(this)
    this.renderClientDetails = this.renderClientDetails.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInviteAdmin = this.handleInviteAdmin.bind(this)
    this.handleCreateNew = this.handleCreateNew.bind(this)
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
    let newClientEntity = new ClientEntity()
    newClientEntity.parentId = claims.partyId
    newClientEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      selected: newClientEntity,
    })
  }

  handleChange(event) {
    let {
      selected,
    } = this.state
    selected[event.target.id] = event.target.value
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({selected})
  }

  handleSaveNew() {
    const {
      selected,
    } = this.state
    const {
      NotificationSuccess,
      NotificationFailure,
    } = this.props
    try {
      this.setState({isLoading: true})
      selected.validate('Create').then(reasonsInvalid => {
        if (reasonsInvalid.count > 0) {
          this.reasonsInvalid = reasonsInvalid
          this.setState({isLoading: false})
        } else {
          selected.create().then(() => {
            NotificationSuccess('Successfully Created Client')
            this.setState({activeState: events.createNewSuccess})
            this.collect()
          }).catch(error => {
            console.error('Error Creating Client', error)
            NotificationFailure('Error Creating Client')
          }).finally(() => {
            this.setState({isLoading: false})
          })
        }
      }).catch(error => {
        console.error('Error Validating Client', error)
        NotificationFailure('Error Validating Client')
        this.setState({isLoading: false})
      })
    } catch (error) {
      console.error('Error Creating Client', error)
    }
  }

  async collect() {
    const {
      NotificationFailure,
    } = this.props

    this.setState({recordCollectionInProgress: true})
    try {
      const collectResponse = await ClientRecordHandler.Collect(
          this.collectCriteria, this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })

      // find the admin user registration status of these clients
      this.clientRegistration =
          (await PartyRegistrar.AreAdminsRegistered({
            partyDetails: collectResponse.records.map(client => {
              return {
                partyId: (new IdIdentifier(client.id)).value,
                partyType: ClientPartyType,
              }
            }),
          })).result
    } catch (e) {
      console.error(`error collecting records: ${e}`)
      NotificationFailure('Failed To Fetch Clients')
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      selected: new ClientEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.setState({
      selectedRowIdx: rowIdx,
      selected: new ClientEntity(rowRecordObj),
      activeState: events.selectExisting,
    })
  }

  async handleInviteAdmin() {
    const {
      selected,
    } = this.state
    const {
      claims,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    this.setState({isLoading: true})
    try {
      // create the minimal admin user
      const newAdminUser = new UserEntity()
      newAdminUser.emailAddress = selected.adminEmailAddress
      newAdminUser.parentPartyType = claims.partyType
      newAdminUser.parentId = claims.partyId
      newAdminUser.partyType = ClientPartyType
      newAdminUser.partyId = selected.identifier
      // perform the invite
      await PartyRegistrar.InviteClientAdminUser({user: newAdminUser})
      NotificationSuccess('Successfully Invited Client Admin User')
    } catch (e) {
      console.error('Failed to Invite Client Admin User', e)
      NotificationFailure('Failed to Invite Client Admin User')
    }
    this.setState({isLoading: false})
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
                {this.renderClientDetails()}
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
                noDataText={'No Clients Found'}
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
                  {
                    Header: 'Admin Registered',
                    accessor: '',
                    filterable: false,
                    sortable: false,
                    Cell: rowCellInfo => {
                      if (this.clientRegistration[rowCellInfo.original.id]) {
                        return 'Yes'
                      } else {
                        return 'No'
                      }
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

  renderClientDetails() {
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
              Select A Client to View or Edit
            </Typography>
          </Grid>
          <Grid item>
            <PeopleIcon className={classes.clientIcon}/>
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
      selected,
    } = this.state

    switch (activeState) {

      case states.viewingExisting:
        return <CardActions>
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={() => this.setState({
                activeState: events.startEditExisting,
              })}
          >
            Edit
          </Button>
          {(!this.clientRegistration[selected.id]) &&
          <Button
              size='small'
              color='primary'
              variant='contained'
              onClick={this.handleInviteAdmin}
          >
            Invite Admin
          </Button>}
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
              onClick={() => this.setState(
                  {activeState: events.cancelCreateNew})}
          >
            Cancel
          </Button>
        </CardActions>

      case states.nop:
      default:
    }
  }
}

Client = withStyles(styles, {withTheme: true})(Client)

Client.propTypes = {
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

Client.defaultProps = {}

export default Client