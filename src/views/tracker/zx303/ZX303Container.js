import React from 'react'
import {connect} from 'react-redux'
import ZX303 from './ZX303'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let ZX303Container = props => {
  return <ZX303 {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
    claims: state.auth.claims,
  }
}

ZX303Container = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
  },
)(ZX303Container)

  export default ZX303Container