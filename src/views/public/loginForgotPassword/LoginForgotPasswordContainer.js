import React from 'react'
import {connect} from 'react-redux'
import {
  SetClaims,
  Login as LoginActionCreator,
} from 'actions/auth'
import LoginForgotPassword from './LoginForgotPassword'
import {
  HideGlobalLoader,
  ShowGlobalLoader,
} from 'actions/app'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'

let LoginForgotPasswordContainer = props => {
  return <LoginForgotPassword {...props} />
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginForgotPasswordContainer = connect(
  mapStateToProps,
  {
    LoginActionCreator,
    SetClaims,
    NotificationSuccess,
    ShowGlobalLoader,
    HideGlobalLoader,
    NotificationFailure,
  }
)(LoginForgotPasswordContainer)

export default LoginForgotPasswordContainer