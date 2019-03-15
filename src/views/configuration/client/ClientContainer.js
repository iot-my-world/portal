import React from 'react'
import {connect} from 'react-redux'
import Client from './Client'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'

let FunctionalContainer = props => {
  return <Client {...props}/>
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
    }
)(FunctionalContainer)

export default FunctionalContainer