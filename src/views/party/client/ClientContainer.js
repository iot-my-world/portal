import React from 'react'
import {connect} from 'react-redux'
import Client from './Client'

let FunctionalContainer = props => {
  return <Client {...props}/>
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