import React from 'react'
import {connect} from 'react-redux'
import TK102 from './TK102'

let TK102Container = props => {
  return <TK102 {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

TK102Container = connect(
    mapStateToProps,
    {},
)(TK102Container)

export default TK102Container