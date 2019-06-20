import React from 'react'
import {connect} from 'react-redux'
import Public from './Public'

let PublicContainer = props => {
  return <Public {...props} />
}

const mapStateToProps = (state) => {
  return {
  }
}

PublicContainer = connect(
  mapStateToProps,
  {
  }
)(PublicContainer)

export default PublicContainer