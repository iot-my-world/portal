import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Grid, TextField,
  withStyles,
  Typography, Fab, Tooltip,
  Collapse,
} from '@material-ui/core'
import {
  FaKey as KeyIcon,
} from 'react-icons/fa'
import {UserAdministrator} from 'brain/user/human/index'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Clear'
import {ReasonsInvalid, ReasonInvalid} from 'brain/validate'

const styles = theme => ({
  securityItemWrapper: {
    margin: 2,
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
  },
  icon: {
    color: theme.palette.text.secondary,
    paddingRight: 5,
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonIcon: {
    margin: theme.spacing(1),
  },
})

const states = {
  nop: 0,
  changingPassword: 1,
}

const events = {
  startChangingPassword: states.changingPassword,
  cancelChangingPassword: states.nop,
  finishedChangingPassword: states.nop,
}

class Security extends Component {

  state = {
    activeState: states.nop,
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }

  reasonsInvalid = new ReasonsInvalid()

  handleStartChangingPassword = () => {
    this.setState({
      activeState: events.startChangingPassword,
    })
  }

  handleCancelChangingPassword = () => {
    this.reasonsInvalid.clearAll()
    this.setState({
      activeState: events.cancelChangingPassword,
    })
  }

  handleSavePasswordChanges = async () => {
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props
    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = this.state

    ShowGlobalLoader()

    this.reasonsInvalid.clearAll()

    // blank checks
    if (oldPassword === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'oldPassword',
        type: 'blank',
        help: 'can\'t be blank',
        data: oldPassword,
      }))
    }
    if (newPassword === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'newPassword',
        type: 'blank',
        help: 'can\'t be blank',
        data: newPassword,
      }))
    }
    if (confirmNewPassword === '') {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'confirmNewPassword',
        type: 'blank',
        help: 'can\'t be blank',
        data: confirmNewPassword,
      }))
    }
    if (this.reasonsInvalid.count > 0) {
      HideGlobalLoader()
      this.forceUpdate()
      return
    }

    // passwords are the same check
    if (newPassword !== confirmNewPassword) {
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'newPassword',
        type: 'invalid',
        help: 'don\'t match',
        data: newPassword,
      }))
      this.reasonsInvalid.addReason(new ReasonInvalid({
        field: 'confirmNewPassword',
        type: 'invalid',
        help: 'don\'t match',
        data: confirmNewPassword,
      }))
    }
    if (this.reasonsInvalid.count > 0) {
      HideGlobalLoader()
      this.forceUpdate()
      return
    }

    // update password
    try {
      if (!(await UserAdministrator.CheckPassword({
        password: oldPassword,
      })).result) {
        this.reasonsInvalid.addReason(new ReasonInvalid({
          field: 'oldPassword',
          type: 'invalid',
          help: 'incorrect',
          data: oldPassword,
        }))
      }
    } catch (e) {
      console.error('error checking existing password', e)
      NotificationFailure('Failed To Change Password')
      HideGlobalLoader()
      return
    }
    if (this.reasonsInvalid.count > 0) {
      HideGlobalLoader()
      this.forceUpdate()
      return
    }

    try {
      await UserAdministrator.UpdatePassword({
        existingPassword: oldPassword,
        newPassword: newPassword,
      })
    } catch (e) {
      console.error('error changing password', e)
      NotificationFailure('Failed To Change Password')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Password Changed Successfully')
    this.setState({
      activeState: events.finishedChangingPassword,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })
    HideGlobalLoader()
  }

  handleTextChange = (e) => {
    const field = e.target.id

    // check if related field should be cleared
    if (field === 'newPassword') {
      if (
          this.reasonsInvalid.errorOnField('confirmNewPassword') &&
          this.reasonsInvalid.errorOnField('confirmNewPassword').help ===
          'don\'t match'
      ) {
        this.reasonsInvalid.clearField('confirmNewPassword')
      }
    } else if (field === 'confirmNewPassword') {
      if (
          this.reasonsInvalid.errorOnField('newPassword') &&
          this.reasonsInvalid.errorOnField('newPassword').help ===
          'don\'t match'
      ) {
        this.reasonsInvalid.clearField('newPassword')
      }
    }
    this.reasonsInvalid.clearField(field)
    this.setState({[field]: e.target.value})
  }

  renderChangePasswordControl = () => {
    const {activeState} = this.state
    const {classes} = this.props

    if (activeState === states.changingPassword) {
      return (
          <Fab
              className={classes.button}
              size={'medium'}
              onClick={this.handleCancelChangingPassword}
          >
            <Tooltip title='Cancel'>
              <CancelIcon className={classes.buttonIcon}/>
            </Tooltip>
          </Fab>
      )
    } else {
      return (
          <Fab
              color={'primary'}
              className={classes.button}
              size={'medium'}
              onClick={this.handleStartChangingPassword}
          >
            <Tooltip title='Edit'>
              <EditIcon className={classes.buttonIcon}/>
            </Tooltip>
          </Fab>
      )
    }
  }

  render() {
    const {classes} = this.props
    const {
      activeState,
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = this.state

    const fieldValidations = this.reasonsInvalid.toMap()

    return (
      <Grid container direction='column' spacing={1} alignItems='center'>
        <Grid item>
          <Card className={classes.detailCard}>
            <CardContent>
              <Grid container direction='column' spacing={1}
                    alignItems={'center'}>
                <Grid item>
                  <div className={classes.securityItemWrapper}>
                    <KeyIcon className={classes.icon}/>
                    <div style={{justifySelf: 'start'}}>
                      <Typography variant={'subtitle1'} color={'textPrimary'}>
                        Change Password
                      </Typography>
                    </div>
                    <div style={{gridColumn: '1/3', gridRow: '2/3'}}>
                      <Typography variant={'caption'} color={'textSecondary'}>
                        It's a good idea to use a strong password that you're not
                        using elsewhere
                      </Typography>
                    </div>
                    <div style={{gridColumn: '3/4', gridRow: '1/3'}}>
                      {this.renderChangePasswordControl()}
                    </div>
                  </div>
                </Grid>
                <Collapse in={activeState === states.changingPassword}>
                  <form>
                    <Grid item>
                      <TextField
                        className={classes.formField}
                        type='password'
                        id='oldPassword'
                        label='Old Password'
                        autoComplete='current-password'
                        value={oldPassword}
                        onChange={this.handleTextChange}
                        helperText={
                          fieldValidations.oldPassword
                            ? fieldValidations.oldPassword.help
                            : undefined
                        }
                        error={!!fieldValidations.oldPassword}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.formField}
                        type='password'
                        id='newPassword'
                        label='New Password'
                        autoComplete='new-password'
                        value={newPassword}
                        onChange={this.handleTextChange}
                        helperText={
                          fieldValidations.newPassword
                            ? fieldValidations.newPassword.help
                            : undefined
                        }
                        error={!!fieldValidations.newPassword}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.formField}
                        type='password'
                        id='confirmNewPassword'
                        label='Confirm New'
                        autoComplete='new-password'
                        value={confirmNewPassword}
                        onChange={this.handleTextChange}
                        helperText={
                          fieldValidations.confirmNewPassword
                            ? fieldValidations.confirmNewPassword.help
                            : undefined
                        }
                        error={!!fieldValidations.confirmNewPassword}
                      />
                    </Grid>
                    <Grid item>
                      <Fab
                        color='primary'
                        aria-label='Save'
                        size={'medium'}
                        className={classes.button}
                        onClick={this.handleSavePasswordChanges}
                      >
                        <Tooltip title='Save Changes'>
                          <SaveIcon className={classes.buttonIcon}/>
                        </Tooltip>
                      </Fab>
                    </Grid>
                  </form>
                </Collapse>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

Security = withStyles(styles)(Security)

Security.propTypes = {
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
}
Security.defaultProps = {}

export default Security