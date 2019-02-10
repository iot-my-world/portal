import React from 'react'
import {connect} from 'react-redux'
import User from './Maps'

let FunctionalContainer = props => {
  return <User {...props}/>
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
