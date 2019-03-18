import React from 'react'
import {connect} from 'react-redux'
import {
  SetClaims,
  Login as LoginActionCreator,
} from 'actions/auth'
import Login from './Login'

let LoginContainer = props => {
  return <Login {...props} />
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginContainer = connect(
    mapStateToProps,
    {
      LoginActionCreator,
      SetClaims,
    }
)(LoginContainer)

export default LoginContainer