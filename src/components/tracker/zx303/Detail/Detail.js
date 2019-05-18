import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'

const styles = theme => ({})

class Detail extends Component {
  render(){
    const {
      width,
    } = this.props

    if (isWidthUp('md', width)) {
      return <div>BIG!</div>
    } else {
      return <div>Small!</div>
    }
  }
}

Detail = withWidth()(withStyles(styles)(Detail))

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  /**
   * boolean indicating if the detail dialog should be open
   */
  show: PropTypes.bool.isRequired,
  /**
   * function which can be called to close the detail dialog
    */
  closeDialog: PropTypes.func.isRequired,
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(HumanUserLoginClaims),
  /**
   * Party from redux state
   */
  party: PropTypes.object.isRequired,  
}
Detail.defaultProps = {}

export default Detail