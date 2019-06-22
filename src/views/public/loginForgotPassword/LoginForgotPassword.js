import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class LoginForgotPassword extends Component {
  render(){
    return <div>Login Forgot Password</div>
  }
}

LoginForgotPassword = withStyles(styles)(LoginForgotPassword)

LoginForgotPassword.propTypes = {}
LoginForgotPassword.defaultProps = {}

export default LoginForgotPassword