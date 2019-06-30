import React from 'react'
import {connect} from 'react-redux'
import Detail from 'components/user/human/detail/Detail'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'
import {
  HideGlobalLoader,
  ShowGlobalLoader,
} from 'actions/app'

let DetailContainer = props => {
  return <Detail {...props}/>
}

const mapStateToProps = (state) => {
  return {
    party: state.auth.party,
    claims: state.auth.claims,
  }
}

DetailContainer = connect(
  mapStateToProps,
  {
    NotificationSuccess,
    NotificationFailure,
    ShowGlobalLoader,
    HideGlobalLoader,
  }
)(DetailContainer)

DetailContainer.propTypes = {
  ...Detail.propTypes,
}

DetailContainer.defaultProps = {
  ...Detail.defaultProps,
}

export default DetailContainer