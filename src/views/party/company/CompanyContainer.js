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

let CompanyContainer = props => {
  return <Company {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

CompanyContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(CompanyContainer)

export default CompanyContainer