import React from 'react'
import {connect} from 'react-redux'
import {
  SetClaims,
  Login as LoginActionCreator,
} from 'actions/auth'
import Login from './Login'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

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
      ShowGlobalLoader,
      HideGlobalLoader,
    }
)(LoginContainer)

export default LoginContainer