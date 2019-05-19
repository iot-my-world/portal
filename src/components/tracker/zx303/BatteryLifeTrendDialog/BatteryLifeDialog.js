import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import Dialog from 'components/Dialog'
import {ZX303 as ZX303Tracker} from 'brain/tracker/zx303/index'
import {
  ZX303StatusReportGenerator,
  ZX303BatteryStatusReport,
} from 'brain/tracker/zx303/reading/status/report'

const styles = theme => ({})

class BatteryLifeTrendDialog extends Component {

  state = {
    batteryStatusReport: new ZX303BatteryStatusReport()
  }

  componentDidMount() {
    this.load()
  }

  load = async () => {
    const {
      zx303Tracker,
      ShowGlobalLoader,
      HideGlobalLoader,
    } = this.props
    ShowGlobalLoader()
    try {
      const batteryStatusReport = (await ZX303StatusReportGenerator.BatteryReport(
        {
          zx303TrackerIdentifier: zx303Tracker.identifier,
        })).report

    } catch (e) {
      console.error('error loading zx303 battery report', e)
    }
    HideGlobalLoader()
  }

  render() {
    const {open, closeDialog} = this.props
    const {timerange} = this.state
    console.log('aweh!', timerange)
    return (
      <Dialog
        fullScreen
        open={open}
        closeDialog={closeDialog}
        title={'ZX303 Battery Life'}
      >
        aweh
      </Dialog>
    )
  }
}

BatteryLifeTrendDialog.propTypes = {
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
   * the zx303 tracker whose battery life is being
   * plotted
   */
  zx303Tracker: PropTypes.instanceOf(ZX303Tracker),
  /**
   * Show Global App Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global App Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
}
BatteryLifeTrendDialog.defaultProps = {}

BatteryLifeTrendDialog = withStyles(styles)(BatteryLifeTrendDialog)

export default BatteryLifeTrendDialog