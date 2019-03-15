import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  CardHeader, TextField,
} from '@material-ui/core'
import {User} from 'brain/party/user'

const styles = theme => ({
  detailCard: {},
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
    }
  }

  render() {
    const {classes} = this.props
    const {user} = this.state
    
    return <Grid container direction="column" spacing={8} alignItems="center">
      <Grid item>
        <Card className={classes.detailCard}>
          <CardHeader title={'Profile'}/>
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