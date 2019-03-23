import React from 'react'
import {connect} from 'react-redux'
import Historical from './Historical'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let HistoricalContainer = props => {
  return <Historical {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

HistoricalContainer = connect(
    mapStateToProps,
    {
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(HistoricalContainer)

export default HistoricalContainer