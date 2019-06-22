import React from 'react'
import {connect} from 'react-redux'
import Info from './Info'

let InfoContainer = props => {
  return <Info {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

InfoContainer = connect(
    mapStateToProps,
    {
    }
)(InfoContainer)

export default InfoContainer