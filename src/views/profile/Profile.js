import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'
import {User} from 'brain/party/user'

const styles = theme => ({
  detailCard: {},
})

class Profile extends Component {
  render() {
    const {classes} = this.props
    return <Grid container direction="column" spacing={8} alignItems="center">
      <Grid item>
        <Card className={classes.detailCard}>
          <CardHeader title={'Profile'}/>
          <CardContent>some stuff</CardContent>
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