import React from 'react'
import {connect} from 'react-redux'
import Live from './Live'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let LiveContainer = props => {
  return <Live {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

LiveContainer = connect(
    mapStateToProps,
    {
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(LiveContainer)

export default LiveContainer