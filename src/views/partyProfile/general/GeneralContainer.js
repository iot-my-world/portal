import React from 'react'
import {connect} from 'react-redux'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'
import General from './General'
import {SetMyUser} from 'actions/auth'

let GeneralContainer = props => {
  return <General {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
  }
}

GeneralContainer = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
    SetMyUser,
  },
)(GeneralContainer)

export default GeneralContainer