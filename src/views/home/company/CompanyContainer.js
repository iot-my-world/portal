import React from 'react'
import {connect} from 'react-redux'
import Company from './Company'

let CompanyContainer = props => {
  return <Company {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

CompanyContainer = connect(
    mapStateToProps,
    {
    }
)(CompanyContainer)

export default CompanyContainer