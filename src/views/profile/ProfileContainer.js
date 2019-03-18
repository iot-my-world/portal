import React from 'react'
import {connect} from 'react-redux'
import Profile from './Profile'
import {NotificationSuccess, NotificationFailure} from 'actions/notification'
import {ShowGlobalLoader, HideGlobalLoader} from 'actions/app'

let ProfileContainer = props => {
  return <Profile {...props}/>
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  }
}

ProfileContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    }
)(ProfileContainer)

export default ProfileContainer