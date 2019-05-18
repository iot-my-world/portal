import React from 'react'
import {connect} from 'react-redux'
import User from './User'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'
import {
  ShowGlobalLoader,
  HideGlobalLoader,
} from 'actions/app'

let UserContainer = props => {
  return <User {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

UserContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(UserContainer)

export default UserContainer