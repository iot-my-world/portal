import React from 'react'
import {connect} from 'react-redux'
import RegisterUser from './RegisterUser'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'

let RegisterUserContainer = props => {
  return <RegisterUser {...props} />
}

const mapStateToProps = (state) => {
  return {}
}

RegisterUserContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
    },
)(RegisterUserContainer)

export default RegisterUserContainer