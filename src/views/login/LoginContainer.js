import React from 'react'
import {connect} from 'react-redux'
import {
  LoginSuccess, LoginFailure,
} from '../../actions/auth'
import Login from './Login'

let LoginContainer = props => {
  const {
    LoginSuccess,
    LoginFailure,
  } = props
  return <Login
    LoginSuccess={LoginSuccess}
    LoginFailure={LoginFailure}
  />
}

const mapStateToProps = (state) => {
  return {
  }
}

LoginContainer = connect(
    mapStateToProps,
    {
      LoginSuccess,
      LoginFailure,
    }
)(LoginContainer)

export default LoginContainer