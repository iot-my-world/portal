import React from 'react'
import {connect} from 'react-redux'
import Detail from './Detail'

let FunctionalContainer = props => {
  return <Detail {...props}/>
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