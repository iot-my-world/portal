import React from 'react'
import {connect} from 'react-redux'
import BarcodeTest from './BarcodeTest'

let BarcodeTestContainer = props => {
  return <BarcodeTest {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

BarcodeTestContainer = connect(
    mapStateToProps,
    {},
)(BarcodeTestContainer)

export default BarcodeTestContainer