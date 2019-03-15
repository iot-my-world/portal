import React from 'react'
import {connect} from 'react-redux'
import Profile from './Profile'

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
    }
)(ProfileContainer)

export default ProfileContainer