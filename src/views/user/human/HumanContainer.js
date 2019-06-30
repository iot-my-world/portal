import React from 'react'
import {connect} from 'react-redux'
import Human from 'views/user/human/Human'
import {
  NotificationSuccess,
  NotificationFailure,
} from 'actions/notification'
import {
  ShowGlobalLoader,
  HideGlobalLoader,
} from 'actions/app'

let HumanContainer = props => {
  return <Human {...props}/>
}

const mapStateToProps = (state) => {
  return {
    claims: state.auth.claims,
    party: state.auth.party,
  }
}

HumanContainer = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
  },
)(HumanContainer)

export default HumanContainer