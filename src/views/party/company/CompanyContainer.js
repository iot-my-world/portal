import React from 'react'
import {connect} from 'react-redux'
import Company from './Company'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'

let FunctionalContainer = props => {
  return <Company {...props}/>
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