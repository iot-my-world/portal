import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class User extends Component {
  render() {
    return <div>User!</div>
  }
}

User = withStyles(styles)(User)

User.propTypes = {

}

User.defaultProps = {
  
}

export default User