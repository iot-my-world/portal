import React from 'react'
import {connect} from 'react-redux'
import {
  SetClaims,
  Login as LoginActionCreator,
} from 'actions/auth'
import Login from './Login'
import {
  HideGlobalLoader,
  ShowGlobalLoader,
} from 'actions/app'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'

let LoginContainer = props => {
  return <Login {...props} />
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginContainer = connect(
    mapStateToProps,
    {
      LoginActionCreator,
      SetClaims,
      NotificationSuccess,
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationFailure,
    }
)(LoginContainer)

export default LoginContainer