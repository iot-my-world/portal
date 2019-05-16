import React from 'react'
import {connect} from 'react-redux'
import App from './NewAPP'
import {
  Logout,
  SetMyParty,
  SetMyUser,
} from 'actions/auth'
import {
  SetViewPermissions,
} from 'actions/permission'
import {
  NotificationFailure,
} from 'actions/notification'

let AppContainer = props => {
  const {
    viewPermissionsSet,
  } = props

  return <App
    {...props}
    appDoneLoading={
      viewPermissionsSet
    }
  />
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,

    viewPermissions: state.permission.view,
    viewPermissionsSet: state.permission.viewPermissionsSet,

    user: state.auth.user,
    party: state.auth.party,
  }
}

AppContainer = connect(
    mapStateToProps,
    {
      SetViewPermissions,
      NotificationFailure,
      Logout,

      SetMyParty,
      SetMyUser,
    }
)(AppContainer)

export default AppContainer