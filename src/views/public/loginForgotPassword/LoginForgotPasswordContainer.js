import React from 'react'
import {connect} from 'react-redux'
import LoginForgotPassword from './LoginForgotPassword'

let LoginForgotPasswordContainer = props => {
  return <LoginForgotPassword {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginForgotPasswordContainer = connect(
    mapStateToProps,
    {
    }
)(LoginForgotPasswordContainer)

export default LoginForgotPasswordContainer