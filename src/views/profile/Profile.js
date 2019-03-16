import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  CardHeader, TextField, Typography, Fab, Tooltip,
} from '@material-ui/core'
import {User} from 'brain/party/user'
import {
  MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'

const styles = theme => ({
  detailCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttonIcon: {
    fontSize: '20px',
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

class Profile extends Component {
  constructor(props) {
    super(props)
    this.handleStartEditing = this.handleStartEditing.bind(this)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.state = {
      user: new User(props.user),
      userCopy: new User(),
      activeState: events.init,
    }
  }

  handleStartEditing() {
    const {user} = this.state
    this.setState({
      userCopy: new User(user),
      activeState: events.startEditing,
    })
  }

  handleSaveChanges() {
    const {user} = this.state
    this.setState({
      activeState: events.saveChanges,
    })
  }

  handleCancel() {
    const {userCopy} = this.state
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
      default:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleStartEditing}
              >
                <Tooltip title='Edit'>
                  <EditIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )
    }
  }

  render() {
    const {classes} = this.props
    const {user} = this.state

    return <Grid container direction="column" spacing={8} alignItems="center">
      <Grid item>
        <Card className={classes.detailCard}>
          <CardHeader title={
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                Profile
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
          }/>
          <CardContent>
            <Grid container direction="column" spacing={8}
                  alignItems={'center'}>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id="name"
                    label="Name"
                    value={user.name}
                    InputProps={{disableUnderline: true}}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.name ? fieldValidations.name.help : undefined
                    // }
                    // error={!!fieldValidations.name}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id="surname"
                    label="Surname"
                    value={user.surname}
                    InputProps={{disableUnderline: true}}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.surname
                    //       ? fieldValidations.surname.help
                    //       : undefined
                    // }
                    // error={!!fieldValidations.surname}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id="username"
                    label="Username"
                    value={user.username}
                    InputProps={{disableUnderline: true}}
                    // onChange={this.handleFieldChange}
                    // disabled={disableFields}
                    // helperText={
                    //   fieldValidations.username
                    //       ? fieldValidations.username.help
                    //       : undefined
                    // }
                    // error={!!fieldValidations.username}
                />
              </Grid>
              <Grid item>
                <TextField
                    className={classes.formField}
                    id="emailAddress"
                    label="EmailAddress"
                    value={user.emailAddress}
                    InputProps={{disableUnderline: true}}
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

Profile = withStyles(styles)(Profile)

Profile.propTypes = {
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
}
Profile.defaultProps = {}

export default Profile