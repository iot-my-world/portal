import React from 'react'
import {connect} from 'react-redux'
import Profile from './Profile'

let ProfileContainer = props => {
  return <Profile {...props}/>
}

const mapStateToProps = (state) => {
  return {
    maxViewDimensions: state.app.maxViewDimensions,
  }
}

ProfileContainer = connect(
    mapStateToProps,
    {
    }
)(ProfileContainer)

export default ProfileContainer