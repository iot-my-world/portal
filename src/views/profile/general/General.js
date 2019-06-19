import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  CardHeader, TextField, Fab, Tooltip,
} from '@material-ui/core'
import {User, UserAdministrator} from 'brain/user/human/index'
import {
  MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import UserValidator from 'brain/user/human/Validator'

const styles = theme => ({
  detailCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
})

const states = {
  nop: 0,
  editing: 1,
}

const events = {
  init: states.nop,
  startEditing: states.editing,
  saveChanges: states.nop,
  cancelEditing: states.nop,
}

class General extends Component {
  constructor(props) {
    super(props)
    this.handleStartEditing = this.handleStartEditing.bind(this)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.state = {
      user: new User(props.user),
      userCopy: new User(),
      activeState: events.init,
    }
  }

  reasonsInvalid = new ReasonsInvalid()

  handleStartEditing() {
    const {user} = this.state
    this.setState({
      userCopy: new User(user),
      activeState: events.startEditing,
    })
  }

  async handleSaveChanges() {
    const {user} = this.state
    const {SetMyUser} = this.props
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await UserValidator.Validate({
        user,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating User', e)
      NotificationFailure('Error Validating User')
      HideGlobalLoader()
      return
    }

    try {
      // perform update
      const response = await UserAdministrator.UpdateAllowedFields({user})
      // update user in redux state
      SetMyUser(response.user)
      this.setState({
        user: response.user,
        activeState: events.saveChanges,
      })
    } catch (e) {
      console.error('error updating allowed fields', e)
      HideGlobalLoader()
      NotificationFailure('Error Updating General')
      return
    }

    NotificationSuccess('Successfully Updated General')
    HideGlobalLoader()
  }

  handleCancel() {
    const {userCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      user: new User(userCopy),
      activeState: events.cancelEditing,
    })
  }

  renderControlIcons() {
    const {activeState} = this.state
    const {classes} = this.props
    switch (activeState) {
      case states.editing:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleSaveChanges}
              >
                <Tooltip title='Save Changes'>
                  <SaveIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCancel}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.nop:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleStartEditing}
              >
                <Tooltip title='Edit'>
                  <EditIcon/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )
      default:
        return null
    }
  }

  handleFieldChange(e) {
    let {user} = this.state
    user[e.target.id] = e.target.value
    this.reasonsInvalid.clearField(e.target.id)
    this.setState({user})
  }

  render() {
    const {classes} = this.props
    const {user, activeState} = this.state
    const fieldValidations = this.reasonsInvalid.toMap()
    const editingState = activeState === states.editing

    return <Grid container direction='column' spacing={1} alignItems='center'>
      <Grid item>
        <Card className={classes.detailCard}>
          <CardHeader title={
            <Grid container
                  direction='row'
                  justify='flex-end'
            >
              <Grid item>
                {this.renderControlIcons()}
              </Grid>
            </Grid>
          }/>
          <CardContent>
            <Grid container direction='column' spacing={1}
                  alignItems={'center'}>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='name'
                    label='Name'
                    value={user.name}
                    InputProps={{
                      disableUnderline: !editingState,
                      readOnly: !editingState,
                    }}
                    onChange={this.handleFieldChange}
                    helperText={
                      fieldValidations.name ?
                          fieldValidations.name.help :
                          undefined
                    }
                    error={!!fieldValidations.name}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id='surname'
                    label='Surname'
                    value={user.surname}
                    InputProps={{
                      disableUnderline: !editingState,
                      readOnly: !editingState,
                    }}
                    onChange={this.handleFieldChange}
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
                    id='username'
                    label='Username'
                    value={user.username}
                    InputProps={{
                      disableUnderline: !editingState,
                      readOnly: !editingState,
                    }}
                    onChange={this.handleFieldChange}
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
                    id='emailAddress'
                    label='EmailAddress'
                    value={user.emailAddress}
                    InputProps={{
                      disableUnderline: true,
                      readOnly: true,
                    }}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.emailAddress
                    //       ? fieldValidations.emailAddress.help
                    //       : undefined
                    // }
                    // error={!!fieldValidations.emailAddress}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  }
}

General = withStyles(styles)(General)

General.propTypes = {
  /**
   * Logged in user from redux
   */
  user: PropTypes.instanceOf(User).isRequired,
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
  /**
   * SetMyUser action creator
   */
  SetMyUser: PropTypes.func.isRequired,
}
General.defaultProps = {}

export default General