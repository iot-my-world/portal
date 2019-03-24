import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  Grid, TextField,
  withStyles,
  Typography, Fab, Tooltip,
  Collapse,
} from '@material-ui/core'
import {
  FaKey as KeyIcon,
} from 'react-icons/fa'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Clear'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

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
    margin: theme.spacing.unit,
  },
  buttonIcon: {
    margin: theme.spacing.unit,
  },
})

const states = {
  nop: 0,
  changingPassword: 1,
}

const events = {
  startChangingPassword: states.changingPassword,
  cancelChangingPassword: states.nop,
}

class Security extends Component {

  constructor(props) {
    super(props)
    this.handleStartChangingPassword =
        this.handleStartChangingPassword.bind(this)
    this.renderChangePasswordControl =
        this.renderChangePasswordControl.bind(this)
    this.handleCancelChangingPassword =
        this.handleCancelChangingPassword.bind(this)
    this.state = {
      activeState: states.nop,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  }

  reasonsInvalid = new ReasonsInvalid()

  handleStartChangingPassword() {
    this.setState({
      activeState: events.startChangingPassword,
    })
  }

  handleCancelChangingPassword() {
    this.setState({
      activeState: events.cancelChangingPassword,
    })
  }

  renderChangePasswordControl() {
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

    return <Grid container direction='column' spacing={8} alignItems='center'>
      <Grid item>
        <Card className={classes.detailCard}>
          <CardContent>
            <Grid container direction='column' spacing={8}
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
                <Grid item>
                  <TextField
                      className={classes.formField}
                      id='oldPassword'
                      label='Old Password'
                      value={oldPassword}
                      // InputProps={{
                      //   disableUnderline: true,
                      //   readOnly: true,
                      // }}
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
                <Grid item>
                  <TextField
                      className={classes.formField}
                      id='newPassword'
                      label='New Password'
                      value={newPassword}
                      // InputProps={{
                      //   disableUnderline: true,
                      //   readOnly: true,
                      // }}
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
                <Grid item>
                  <TextField
                      className={classes.formField}
                      id='confirmNewPassword'
                      label='Confirm New'
                      value={confirmNewPassword}
                      // InputProps={{
                      //   disableUnderline: true,
                      //   readOnly: true,
                      // }}
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
                <Grid item>
                  <Fab
                      color="primary"
                      aria-label="Save"
                      size={'medium'}
                      className={classes.button}
                  >
                    <Tooltip title='Save Changes'>
                      <SaveIcon className={classes.buttonIcon}/>
                    </Tooltip>
                  </Fab>
                </Grid>
              </Collapse>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  }
}

Security = withStyles(styles)(Security)

Security.propTypes = {}
Security.defaultProps = {}

export default Security