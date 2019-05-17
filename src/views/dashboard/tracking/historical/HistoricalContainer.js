import React from 'react'
import {connect} from 'react-redux'
import Historical from './Historical'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'
import {NotificationFailure} from 'actions/notification'

let HistoricalContainer = props => {
  return <Historical {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

HistoricalContainer = connect(
    mapStateToProps,
    {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationFailure,
    },
)(HistoricalContainer)

export default HistoricalContainer