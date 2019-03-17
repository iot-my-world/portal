import React from 'react'
import {connect} from 'react-redux'
import RegisterUser from './RegisterUser'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {Logout} from 'actions/auth'

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
      Logout,
    },
)(RegisterUserContainer)

export default RegisterUserContainer