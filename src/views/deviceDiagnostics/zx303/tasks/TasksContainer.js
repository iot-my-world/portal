import React from 'react'
import {connect} from 'react-redux'
import Tasks from './Tasks'
import {NotificationFailure, NotificationSuccess} from 'actions/notification'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let TasksContainer = props => {
  return <Tasks {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
    claims: state.auth.claims,
  }
}

TasksContainer = connect(
    mapStateToProps,
    {
      NotificationSuccess,
      NotificationFailure,
      ShowGlobalLoader,
      HideGlobalLoader,
    },
)(TasksContainer)

export default TasksContainer