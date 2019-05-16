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
    partySet,
    userSet,
  } = props

  return <App
    {...props}
    appDoneLoading={
      viewPermissionsSet &&
      partySet &&
      userSet
    }
  />
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,

    viewPermissions: state.permission.view,
    viewPermissionsSet: state.permission.viewPermissionsSet,

    user: state.auth.user,
    userSet: state.auth.userSet,

    party: state.auth.party,
    partySet: state.auth.partySet,
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