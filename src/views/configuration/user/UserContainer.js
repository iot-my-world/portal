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

let FunctionalContainer = props => {
  return <User {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    maxViewDimensions: state.app.maxViewDimensions,
    party: state.auth.party,
  }
}

FunctionalContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(FunctionalContainer)

export default FunctionalContainer