import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  CardHeader,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import {BEPTable} from 'components/table/index'
import {User as UserEntity, UserRecordHandler} from 'brain/party/user'
import {FullPageLoader} from 'components/loader/index'
import {ReasonsInvalid} from 'brain/validate/index'
import {Text} from 'brain/search/criterion/types'
import {Query} from 'brain/search/index'
import {LoginClaims} from 'brain/security/claims'

const styles = theme => ({
  formField: {
    height: "60px",
    width: "150px"
  },
  progress: {
    margin: 2
  },
  detailCard: {},
  userIcon: {
    fontSize: 100,
    color: theme.palette.primary.main
  }
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3
}

const events = {
  init: states.nop,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.nop,
  cancelEditExisting: states.nop
}

class User extends Component {
  state = {
    recordCollectionInProgress: false,
    isLoading: false,
    activeState: events.init,
    selected: new UserEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0
  }

  reasonsInvalid = new ReasonsInvalid()

  collectCriteria = []
  collectQuery = new Query()

  constructor(props) {
    super(props)
    this.renderControls = this.renderControls.bind(this)
    this.renderUserDetails = this.renderUserDetails.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
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
    const {claims} = this.props
    let newUserEntity = new UserEntity()
    newUserEntity.parentId = claims.partyId
    newUserEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      selected: newUserEntity
    })
  }

  handleFieldChange(event) {
    let {selected} = this.state
    selected[event.target.id] = event.target.value
    this.reasonsInvalid.clearField(event.target.id)
    this.setState({selected})
  }

  async handleSaveNew() {
    const {selected} = this.state
    const {NotificationSuccess, NotificationFailure} = this.props

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
      console.error('Error Validating User', e)
      NotificationFailure('Error Validating User')
      this.setState({isLoading: false})
      return
    }

    // if validation passes, perform create
    try {
      await selected.create()
      NotificationSuccess('Successfully Created User')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
      this.setState({isLoading: false})
    } catch (e) {
      console.error('Error Creating User', e)
      NotificationFailure('Error Creating User')
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
      activeState: events.startEditExisting
    })
  }

  handleCancelEditExisting() {
    this.setState({activeState: events.finishEditExisting})
  }

  collect() {
    const {NotificationFailure} = this.props

    this.setState({recordCollectionInProgress: true})
    UserRecordHandler.Collect(this.collectCriteria, this.collectQuery)
      .then(response => {
        this.setState({
          records: response.records,
          totalNoRecords: response.total
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
      selected: new UserEntity(),
      selectedRowIdx: -1
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: rowIdx,
      selected: new UserEntity(rowRecordObj),
      activeState: events.selectExisting
    })
  }

  render() {
    const {
      isLoading,
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
      activeState,
    } = this.state
    const {theme, classes} = this.props

    let cardTitle = ''
    switch (activeState) {
      case states.editingNew:
        cardTitle = 'Creating New'
        break
      case states.editingExisting:
        cardTitle = 'Editing'
        break
      case states.viewingExisting:
        cardTitle = 'Details'
        break
      default:
    }

    return (
      <Grid container direction="column" spacing={8} alignItems="center">
        <Grid item xl={12}>
          <Grid container>
            <Grid item>
              <Card className={classes.detailCard}>
                <CardHeader title={cardTitle}/>
                <CardContent>{this.renderUserDetails()}</CardContent>
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
                noDataText={"No Companies Found"}
                data={records}
                onCriteriaQueryChange={this.handleCriteriaQueryChange}
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                    config: {
                      filter: {
                        type: Text
                      }
                    }
                  },
                  {
                    Header: "Email",
                    accessor: "emailAddress",
                    config: {
                      filter: {
                        type: Text
                      }
                    }
                  },
                  {
                    Header: "Registered",
                    accessor: "registered",
                    Cell: rowCellInfo => {
                      if (rowCellInfo.value) {
                        return 'true'
                      } else {
                        return 'false'
                      }
                    },
                    filterable: false
                  },
                  {
                    Header: "Roles",
                    accessor: "roles",
                    Cell: rowCellInfo => {
                      let roles = ''
                      rowCellInfo.value.forEach(role => (roles += `${role}, `))
                      return roles
                    },
                    sortable: false,
                    filterable: false
                  }
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
                      background:
                        rowIndex === selectedRowIdx
                          ? theme.palette.secondary.light
                          : "white",
                      color:
                        rowIndex === selectedRowIdx
                          ? theme.palette.secondary.contrastText
                          : theme.palette.primary.main
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <FullPageLoader open={isLoading} />
      </Grid>
    )
  }

  renderUserDetails() {
    const {isLoading, activeState} = this.state
    const {classes} = this.props

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === states.viewingExisting

    switch (activeState) {
      case states.nop:
        return (
          <Grid container direction="column" spacing={8} alignItems={"center"}>
            <Grid item>
              <Typography variant={"body1"} align={"center"} color={"primary"}>
                Select A User to View or Edit
              </Typography>
            </Grid>
            <Grid item>
              <PersonIcon className={classes.userIcon} />
            </Grid>
            <Grid item>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={this.handleCreateNew}
              >
                Create New
              </Button>
            </Grid>
          </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {selected} = this.state
        return (
          <Grid container direction="column" spacing={8} alignItems={"center"}>
            <Grid item>
              <TextField
                  className={classes.formField}
                  id="name"
                  label="Name"
                  value={selected.name}
                  onChange={this.handleFieldChange}
                  disabled={isLoading}
                  InputProps={{disableUnderline: stateIsViewing}}
                  helperText={
                  fieldValidations.name ? fieldValidations.name.help : undefined
                }
                  error={!!fieldValidations.name}
              />
            </Grid>
            <Grid item>
              <TextField
                  className={classes.formField}
                  id="surname"
                  label="Surname"
                  value={selected.surname}
                  onChange={this.handleFieldChange}
                  disabled={isLoading}
                  InputProps={{disableUnderline: stateIsViewing}}
                  helperText={
                  fieldValidations.surname
                    ? fieldValidations.surname.help
                    : undefined
                }
                  error={!!fieldValidations.surname}
              />
            </Grid>
            <Grid item>
              <TextField
                  className={classes.formField}
                  id="username"
                  label="Username"
                  value={selected.username}
                  onChange={this.handleFieldChange}
                  disabled={isLoading}
                  InputProps={{disableUnderline: stateIsViewing}}
                  helperText={
                  fieldValidations.username
                    ? fieldValidations.username.help
                    : undefined
                }
                  error={!!fieldValidations.username}
              />
            </Grid>
            <Grid item>
              <TextField
                  className={classes.formField}
                  id="emailAddress"
                  label="EmailAddress"
                  value={selected.emailAddress}
                  onChange={this.handleFieldChange}
                  disabled={isLoading}
                  InputProps={{disableUnderline: stateIsViewing}}
                  helperText={
                  fieldValidations.emailAddress
                    ? fieldValidations.emailAddress.help
                    : undefined
                }
                  error={!!fieldValidations.emailAddress}
              />
            </Grid>
          </Grid>
        )

      default:
    }
  }

  renderControls() {
    const {activeState} = this.state

    switch (activeState) {
      case states.viewingExisting:
        return (
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleStartEditExisting}
            >
              Edit
            </Button>
            <Button size="small" color="primary" variant="contained">
              Invite Admin
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleCreateNew}
            >
              Create New
            </Button>
          </CardActions>
        )

      case states.editingNew:
        return (
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleSaveNew}
            >
              Save New
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleCancelCreateNew}
            >
              Cancel
            </Button>
          </CardActions>
        )

      case states.editingExisting:
        return (
          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={this.handleCancelEditExisting}
            >
              Cancel
            </Button>
          </CardActions>
        )

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
  claims: PropTypes.instanceOf(LoginClaims)
}

User.defaultProps = {}

export default User
