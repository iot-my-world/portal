import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Card, CardContent,
  Grid,
} from '@material-ui/core'
import MomentUtils from '@date-io/moment'
import {MuiPickersUtilsProvider, DatePicker} from 'material-ui-pickers'
import Dialog from 'components/Dialog'
import {ZX303 as ZX303Tracker} from 'brain/tracker/zx303/index'
import {
  ZX303StatusReportGenerator,
  ZX303BatteryStatusReport,
} from 'brain/tracker/zx303/reading/status/report'
import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import moment from 'moment'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr',
    justifyItems: 'center',
    overflow: 'auto',
  },
})

class BatteryLifeTrendDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      batteryStatusReport: new ZX303BatteryStatusReport(),
      startDate: moment().startOf('day').utc().unix(),
      endDate: moment().endOf('day').utc().unix(),
    }
    this.loadTimeout = () => {
    }
  }

  componentDidMount() {
    this.load()
  }

  handleStartDateChange = (newDate) => {
    this.setState({startDate: newDate.startOf('day').utc().unix()})
    this.loadTimeout = setTimeout(this.load, 100)
  }

  handleEndDateChange = (newDate) => {
    this.setState({endDate: newDate.endOf('day').utc().unix()})
    this.loadTimeout = setTimeout(this.load, 100)
  }

  load = async () => {
    const {
      zx303Tracker,
      ShowGlobalLoader,
      HideGlobalLoader,
    } = this.props
    const {startDate, endDate} = this.state
    ShowGlobalLoader()
    try {
      this.setState({
        batteryStatusReport: (await ZX303StatusReportGenerator.BatteryReport(
          {
            zx303TrackerIdentifier: zx303Tracker.identifier,
            startDate,
            endDate,
          })).report,
      })
    } catch (e) {
      console.error('error loading zx303 battery report', e)
    }
    HideGlobalLoader()
  }

  render() {
    const {open, closeDialog, classes, theme} = this.props
    const {
      batteryStatusReport,
      startDate,
      endDate,
    } = this.state

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'ZX303 Battery Life'}
        fullWidth={true}
        maxWidth={'md'}
      >
        <div
          className={classes.root}
          style={{gridRowGap: 8}}
        >
          <Card>
            <Grid
              container
              spacing={8}
              style={{padding: '0 5px 0 5px'}}
              justify={'center'}
            >
              <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    margin="normal"
                    label="From Start Of Date"
                    value={moment.unix(startDate).format('YYYY-MM-DD')}
                    onChange={this.handleStartDateChange}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    margin="normal"
                    label="To End Of Date"
                    value={moment.unix(endDate).format('YYYY-MM-DD')}
                    onChange={this.handleEndDateChange}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </Card>
          <Card>
            <CardContent>
              <AreaChart
                width={800} height={300}
                data={batteryStatusReport.readings}
                margin={{top: 10, right: 20, left: 30, bottom: 40}}
              >
                <XAxis
                  dataKey="timestamp"
                  type={'number'}
                  scale={'time'}
                  domain={['dataMin', 'dataMax']}
                  tick={TimeTick}
                />
                <YAxis
                  label={{
                    value: 'Battery %',
                    angle: -90,
                    position: 'insideLeft',
                    stroke: theme.palette.grey[500],
                  }}
                />
                <CartesianGrid strokeDasharray="3 3"/>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="40%"  stopColor="#10FF00" stopOpacity="8"/>
                    <stop offset="95%" stopColor="#FF0000" stopOpacity="8"/>
                  </linearGradient>
                </defs>
                <Tooltip/>
                <Area
                  type='monotone'
                  dataKey='batteryPercentage'
                  stroke={theme.palette.grey[500]}
                  fill='url(#areaColor)'
                />
              </AreaChart>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    )
  }
}

const TimeTick = props => {
  const {
    x, y,
    // stroke,
    payload,
  } = props

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dx={10}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-25)"
      >
        {moment.unix(payload.value).format('YYYY-MM-DD HH:mm:ss')}
      </text>
    </g>
  )
}

BatteryLifeTrendDialog.propTypes = {
  theme: PropTypes.object.isRequired,
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

BatteryLifeTrendDialog = withStyles(styles, {withTheme: true})(BatteryLifeTrendDialog)

export default BatteryLifeTrendDialog