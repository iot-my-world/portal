import React from 'react'
import {connect} from 'react-redux'
import System from './System'

let SystemContainer = props => {
  return <System {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

SystemContainer = connect(
    mapStateToProps,
    {
    }
)(SystemContainer)

export default SystemContainer