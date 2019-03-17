import React from 'react'
import {connect} from 'react-redux'
import Company from './Company'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'
import {
  ShowGlobalLoader,
  HideGlobalLoader,
} from 'actions/app'

let FunctionalContainer = props => {
  return <Company {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    maxViewDimensions: state.app.maxViewDimensions,
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