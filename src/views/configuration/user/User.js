import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Grid, Card, CardContent, CardActions, Typography,
  Button, TextField,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import {
  BEPTable,
} from 'components/table/index'
import {
  User as UserEntity,
  UserRecordHandler,
} from 'brain/party/user/index'
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
  userIcon: {
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

class User extends Component {

  state = {
    recordCollectionInProgress: false,
    isLoading: false,
    activeState: events.init,
    selected: new UserEntity(),
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
    this.renderUserDetails = this.renderUserDetails.bind(this)
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
    let newUserEntity = new UserEntity()
    newUserEntity.parentId = claims.partyId
    newUserEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      selected: newUserEntity,
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
            NotificationSuccess('Successfully Created User')
            this.setState({activeState: events.createNewSuccess})
            this.collect()
          }).catch(error => {
            console.error('Error Creating User', error)
            NotificationFailure('Error Creating User')
          }).finally(() => {
            this.setState({isLoading: false})
          })
        }
      }).catch(error => {
        console.error('Error Validating User', error)
        NotificationFailure('Error Validating User')
        this.setState({isLoading: false})
      })
    } catch (error) {
      console.error('Error Creating User', error)
    }
  }

  collect() {
    const {
      NotificationFailure,
    } = this.props

    this.setState({recordCollectionInProgress: true})
    UserRecordHandler.Collect(this.collectCriteria, this.collectQuery)
        .then(response => {
          this.setState({
            records: response.records,
            totalNoRecords: response.total,
          })
        })
        .catch(error => {
          console.error(`error collecting records: ${error}`)
          NotificationFailure('Failed To Fetch Users')
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
      selected: new UserEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.setState({
      selectedRowIdx: rowIdx,
      selected: new UserEntity(rowRecordObj),
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
    PartyRegistrar.InviteUserAdminUser(selected.identifier).then(() => {
      NotificationSuccess('Successfully Invited User Admin User')
    }).catch(error => {
      console.error('Failed to Invite User Admin User', error)
      NotificationFailure('Failed to Invite User Admin User')
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
                {this.renderUserDetails()}
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
                noDataText={'No Users Found'}
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

  renderUserDetails() {
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
              Select A User to View or Edit
            </Typography>
          </Grid>
          <Grid item>
            <PersonIcon className={classes.userIcon}/>
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
              onClick={() => this.setState({
                selectedRowIdx: -1,
                activeState: events.startCreateNew,
                selected: new UserEntity(),
              })}
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

User = withStyles(styles, {withTheme: true})(User)

User.propTypes = {
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

User.defaultProps = {}

export default User