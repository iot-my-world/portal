import React from 'react'
import {connect} from 'react-redux'
import SF001 from './SF001'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

  let SF001Container = props => {
  return <SF001 {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
    claims: state.auth.claims,
  }
}

SF001Container = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
  },
)(SF001Container)

export default SF001Container