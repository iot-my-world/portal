import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import {User} from 'brain/party/user'

const styles = theme => ({})

class Profile extends Component {
  render(){
    return <div>User</div>
  }
}

Profile = withStyles(styles)(Profile)

Profile.propTypes = {
  /**
   * Logged in user from redux
   */
  user: PropTypes.instanceOf(User).isRequired,
}
Profile.defaultProps = {}

export default Profile