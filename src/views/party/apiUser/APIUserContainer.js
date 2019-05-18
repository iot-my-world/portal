import React from 'react'
import {connect} from 'react-redux'
import APIUser from './APIUser'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let APIUserContainer = props => {
  return <APIUser {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
    claims: state.auth.claims,
    user: state.auth.user,
  }
}

APIUserContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(APIUserContainer)

export default APIUserContainer