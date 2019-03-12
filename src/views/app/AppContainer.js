import React from 'react'
import {connect} from 'react-redux'
import App from './App'
import {
  Logout,
  SetMyParty,
} from 'actions/auth'
import {
  SetViewPermissions,
} from 'actions/permission'
import {
  AppDoneLoading,
} from 'actions/app'

let AppContainer = props => {
  return <App {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    appDoneLoading: state.app.doneLoading,
  }
}

AppContainer = connect(
    mapStateToProps,
    {
      Logout,
      SetViewPermissions,
      AppDoneLoading,
      SetMyParty,
    }
)(AppContainer)

export default AppContainer