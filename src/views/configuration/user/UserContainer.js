import React from 'react'
import {connect} from 'react-redux'
import User from './User'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'

let FunctionalContainer = props => {
  return <User {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
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