import React from 'react'
import {connect} from 'react-redux'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'
import Security from './Security'

let SecurityContainer = props => {
  return <Security {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

SecurityContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(SecurityContainer)

export default SecurityContainer