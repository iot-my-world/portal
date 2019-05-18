import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import Dialog from 'components/Dialog'

const styles = theme => ({
})

class Detail extends Component {
  render() {
    const {
      open,
      closeDialog,
    } = this.props

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'ZX303 Tracker'}
      >
        <div>Hello!</div>
      </Dialog>
    )

  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * boolean indicating if the detail dialog should be open
   */
  open: PropTypes.bool.isRequired,
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

Detail = withStyles(styles)(Detail)

export default Detail