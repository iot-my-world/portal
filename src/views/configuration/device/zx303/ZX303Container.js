import React from 'react'
import {connect} from 'react-redux'
import ZX303 from './ZX303'

let FunctionalContainer = props => {
  return <ZX303 {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

FunctionalContainer = connect(
    mapStateToProps,
    {},
)(FunctionalContainer)

export default FunctionalContainer