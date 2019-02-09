import React from 'react'
import {connect} from 'react-redux'
import App from './App'
import {Logout} from 'actions/auth'

let AppContainer = props => {
  return <App {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

AppContainer = connect(
    mapStateToProps,
    {
      Logout,
    }
)(AppContainer)

export default AppContainer