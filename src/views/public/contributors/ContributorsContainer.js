import React from 'react'
import {connect} from 'react-redux'
import Contributors from './Contributors'

let ContributorsContainer = props => {
  return <Contributors {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

ContributorsContainer = connect(
    mapStateToProps,
    {
    }
)(ContributorsContainer)

export default ContributorsContainer