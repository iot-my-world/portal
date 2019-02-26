import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Paper, withStyles, Grid, Typography,
} from '@material-ui/core'
import Query from 'brain/search/Query'
import {RecordHandler as ReadingRecordHandler} from 'brain/tracker/reading/index'
import Reading from 'brain/tracker/reading/Reading'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
  },
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

class Live extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.state = {
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 3.5,
        bearing: 0,
        pitch: 0,
      },
      popupInfo: null,
      isLoading: true,
    }
  }

  componentDidMount() {
    this.collect()
  }

  async collect(){
    const newQuery = new Query()
    newQuery.limit = 0

    let collectReadingsResponse
    try {
      collectReadingsResponse = await ReadingRecordHandler.Collect([], newQuery)
    } catch (e) {
      console.error('error collecting readings', e)
    }

    const readings = collectReadingsResponse.records.map(reading => new Reading(reading))
    console.log(readings)


    this.setState({
      isLoading: false,
      locationData: readings
    })
  }

  render(){
    const {
      classes,
    } = this.props
    return <div className={classes.root}>
      <div>
        <Paper>
          <Grid container direction='column'>
            <Grid item>
              <Typography variant={'h6'}>
                Filters
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div>

      </div>
    </div>
  }
}

Live = withStyles(styles)(Live)

Live.propTypes = {}
Live.defaultProps = {}

export default Live