import React from 'react'
import {connect} from 'react-redux'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'
import General from './General'

let GeneralContainer = props => {
  return <General {...props}/>
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  }
}

GeneralContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(GeneralContainer)

export default GeneralContainer