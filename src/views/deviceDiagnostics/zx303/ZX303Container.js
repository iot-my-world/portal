import React from 'react'
import {connect} from 'react-redux'
import ZX303 from './ZX303'

let ZX303Container = props => {
  return <ZX303 {...props}/>
}

const mapStateToProps = (state) => {
  return {
    maxViewDimensions: state.app.maxViewDimensions,
  }
}

ZX303Container = connect(
    mapStateToProps,
    {},
)(ZX303Container)

export default ZX303Container