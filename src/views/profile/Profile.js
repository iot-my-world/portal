import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Profile extends Component {
  render(){
    return <div>User</div>
  }
}

Profile = withStyles(styles)(Profile)

Profile.propTypes = {}
Profile.defaultProps = {}

export default Profile