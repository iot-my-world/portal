import React, {Component} from 'react'
import {
  TimCard, TimCardHeader, TimCardBody, TimCardIcon,
} from 'components/timDashboard/timCard'
import DeviceIcon from '@material-ui/icons/DevicesOther'
// import PropTypes from 'prop-types'
import {
  withStyles, Grid, Typography,
} from '@material-ui/core'
import {grayColor} from 'components/timDashboard/timDashboard'
import LiveTrackingImage from 'assets/images/liveTracking.png'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
  cardCategory: {
    color: grayColor[0],
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0',
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: 'Roboto',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: grayColor[1],
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  stats: {
    color: grayColor[0],
    display: 'inline-flex',
    fontSize: '12px',
    lineHeight: '22px',
    '& svg': {
      top: '4px',
      width: '16px',
      height: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      top: '4px',
      fontSize: '16px',
      position: 'relative',
      marginRight: '3px',
      marginLeft: '3px',
    },
  },
})

class Company extends Component {
  render() {
    const {
      classes,
      history,
    } = this.props

    return <Grid
        className={classes.root}
        container
        direction='column'
    >
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <TimCard>
              <TimCardHeader color='success' stats icon>
                <TimCardIcon color='success'>
                  <DeviceIcon/>
                </TimCardIcon>
              </TimCardHeader>
              <TimCardBody>
                <Typography color='primary' variant='subtitle1'>
                  Active Devices
                </Typography>
                <Typography variant='body1'>
                  5
                </Typography>
              </TimCardBody>
            </TimCard>
          </Grid>
          <Grid item>
            <TimCard>
              <TimCardHeader color='warning' stats icon>
                <TimCardIcon color='warning'>
                  <DeviceIcon/>
                </TimCardIcon>
              </TimCardHeader>
              <TimCardBody>
                <Typography color='primary' variant='subtitle1'>
                  Devices In Transit
                </Typography>
                <Typography variant='body1'>
                  100
                </Typography>
              </TimCardBody>
            </TimCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <TimCard
                onClick={() => history.push('/app/dashboard/liveTracking')}>
              <TimCardHeader color='primary'>
                <img id='photo' src={LiveTrackingImage} alt='' style={{
                  width: 300,
                  borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0',
                }}/>
              </TimCardHeader>
              <TimCardBody>
                <Typography color='primary' variant='h6'>
                  Live Asset Tracking
                </Typography>
                <Typography variant='subtitle2'>
                  The Latest Location Of All Of Your Tracked Assets
                </Typography>
              </TimCardBody>
            </TimCard>
          </Grid>
          <Grid item>
            <TimCard onClick={() => history.push(
                '/app/dashboard/historicalTracking')}>
              <TimCardHeader color='primary'>
                <img id='photo' src={LiveTrackingImage} alt='' style={{
                  width: 300,
                  borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0',
                }}/>
              </TimCardHeader>
              <TimCardBody>
                <Typography color='primary' variant='h6'>
                  Historical Asset Tracking
                </Typography>
                <Typography variant='subtitle2'>
                  The Path Your Assets Have Travelled
                </Typography>
              </TimCardBody>
            </TimCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {}

Company.defaultProps = {}

export default Company