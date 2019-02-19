import React from 'react'
import {connect} from 'react-redux'
import Maps from './Maps'

let FunctionalContainer = props => {
  return <Maps {...props}/>
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
