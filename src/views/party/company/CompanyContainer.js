import React from 'react'
import {connect} from 'react-redux'
import Company from './Company'

let FunctionalContainer = props => {
  return <Company {...props}/>
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