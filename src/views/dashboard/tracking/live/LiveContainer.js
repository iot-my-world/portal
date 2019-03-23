import React from 'react'
import {connect} from 'react-redux'
import Live from './Live'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let HistoricalContainer = props => {
  return <Live {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    maxViewDimensions: state.app.maxViewDimensions,
  }
}

HistoricalContainer = connect(
    mapStateToProps,
    {
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(HistoricalContainer)

export default HistoricalContainer