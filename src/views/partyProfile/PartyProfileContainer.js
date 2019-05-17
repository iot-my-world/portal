import React from 'react'
import {connect} from 'react-redux'
import PartyProfile from './PartyProfile'

let PartyProfileContainer = props => {
  return <PartyProfile {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

PartyProfileContainer = connect(
  mapStateToProps,
  {
  }
)(PartyProfileContainer)

export default PartyProfileContainer