import React from 'react'
import {connect} from 'react-redux'
import Client from './Client'

let ClientContainer = props => {
  return <Client {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

ClientContainer = connect(
    mapStateToProps,
    {
    }
)(ClientContainer)

export default ClientContainer