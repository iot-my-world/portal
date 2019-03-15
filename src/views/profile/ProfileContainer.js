import React from 'react'
import {connect} from 'react-redux'
import Profile from './Profile'
import {NotificationSuccess, NotificationFailure} from 'actions/notification'

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
    }
)(ProfileContainer)

export default ProfileContainer