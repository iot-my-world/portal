import React from 'react'
import {connect} from 'react-redux'
import ResetPassword from './ResetPassword'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {Logout} from 'actions/auth'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let ResetPasswordContainer = props => {
  return <ResetPassword {...props} />
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
  }
}

ResetPasswordContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
      Logout,
    },
)(ResetPasswordContainer)

export default ResetPasswordContainer