import React from 'react'
import {connect} from 'react-redux'
import Client from './Client'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'
import {
  ShowGlobalLoader,
  HideGlobalLoader,
} from 'actions/app'

let ClientContainer = props => {
  return <Client {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

ClientContainer = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
  },
)(ClientContainer)

export default ClientContainer