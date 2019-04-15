import React from 'react'
import {connect} from 'react-redux'
import RegisterUser from './RegisterUser'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {Logout} from 'actions/auth'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let RegisterUserContainer = props => {
  return <RegisterUser {...props} />
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
  }
}

RegisterUserContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
      Logout,
    },
)(RegisterUserContainer)

export default RegisterUserContainer