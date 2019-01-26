import React from 'react'
import {connect} from 'react-redux'
import Website from './Website'

let FunctionalContainer = props => {
  return <Website/>
}

const mapStateToProps = (state) => {
  return {
  }
}

FunctionalContainer = connect(
    mapStateToProps,
    {
    }
)(FunctionalContainer)

export default FunctionalContainer