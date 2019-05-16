import React from 'react'
import {connect} from 'react-redux'
import Device from './Device'

let DeviceContainer = props => {
  return <Device {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

DeviceContainer = connect(
    mapStateToProps,
    {},
)(DeviceContainer)

export default DeviceContainer