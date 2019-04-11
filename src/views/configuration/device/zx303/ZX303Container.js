import React from 'react'
import {connect} from 'react-redux'
import ZX303 from './ZX303'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let FunctionalContainer = props => {
  return <ZX303 {...props}/>
}

const mapStateToProps = (state) => {
  return {
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