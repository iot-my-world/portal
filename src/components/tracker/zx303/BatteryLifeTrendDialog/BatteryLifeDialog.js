import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'
import Dialog from 'components/Dialog'
import {ZX303 as ZX303Tracker} from 'brain/tracker/zx303/index'
import {
  ZX303StatusReportGenerator,
  ZX303BatteryStatusReport,
} from 'brain/tracker/zx303/reading/status/report'
import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend,
} from 'recharts'

const styles = theme => ({})

class BatteryLifeTrendDialog extends Component {

  state = {
    batteryStatusReport: new ZX303BatteryStatusReport(),
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
      this.setState({
        batteryStatusReport: (await ZX303StatusReportGenerator.BatteryReport(
          {
            zx303TrackerIdentifier: zx303Tracker.identifier,
          })).report,
      })
    } catch (e) {
      console.error('error loading zx303 battery report', e)
    }
    HideGlobalLoader()
  }

  render() {
    const {open, closeDialog} = this.props
    const {batteryStatusReport} = this.state

    return (
      <Dialog
        fullScreen
        open={open}
        closeDialog={closeDialog}
        title={'ZX303 Battery Life'}
      >
        <LineChart width={600} height={300} data={batteryStatusReport.readings}
                   margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="timestamp"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend/>
          <Line type="monotone" dataKey="batteryPercentage" stroke="#8884d8"/>
        </LineChart>
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