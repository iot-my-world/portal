import React, {Component} from 'react'
import {connect} from 'react-redux'

let FunctionalContainer = props => {
  return <div>functional container template</div>
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