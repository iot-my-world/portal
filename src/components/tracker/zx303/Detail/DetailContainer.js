import React from 'react'
import {connect} from 'react-redux'
import Detail from './Detail'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'

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
    }
)(DetailContainer)

DetailContainer.propTypes = {
  ...Detail.propTypes,
}

DetailContainer.defaultProps = {
  ...Detail.defaultProps,
}

export default DetailContainer