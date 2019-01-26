import React from 'react'
import {connect} from 'react-redux'
import Login from './Login'

let LoginContainer = props => {
  return <Login/>
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginContainer = connect(
    mapStateToProps,
    {
    }
)(LoginContainer)

export default LoginContainer