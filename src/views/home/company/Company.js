import React, {Component} from 'react'
import {
  TimCard, TimCardHeader, TimCardBody,
} from 'components/timDashboard/timCard'

// import PropTypes from 'prop-types'
import {
  withStyles, Grid, Typography,
} from '@material-ui/core'
import {grayColor} from 'components/timDashboard/timDashboard'
import LiveTrackingImage from 'assets/images/liveTracking.png'

const styles = theme => ({
  cardCategory: {
    color: grayColor[0],
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    paddingTop: '10px',
    marginBottom: '0'
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
      lineHeight: '1'
    }
  },
})

class Company extends Component {
  render() {
    const {
      classes,
    } = this.props

    return <Grid container direction='column'>
      <Grid item xs={12}>
        <Grid container>
          asdf
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <Grid item>
            <TimCard chart>
              <TimCardHeader color='primary'>
                <img id='photo' src={LiveTrackingImage} alt='' style={{width: 300, borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0'}}/>
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
            <TimCard chart>
              <TimCardHeader color='primary'>
                <img id='photo' src={LiveTrackingImage} alt='' style={{width: 300, borderRadius: 'calc(.25rem - 1px) calc(.25rem - 1px) 0 0'}}/>
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

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company