import React from 'react'
import {connect} from 'react-redux'
import {
  SetClaims,
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
      SetClaims,
    }
)(LoginContainer)

export default LoginContainer