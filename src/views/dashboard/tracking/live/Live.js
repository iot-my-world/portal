import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Paper, withStyles, Grid, Typography,
  ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core'
import Query from 'brain/search/Query'
import {RecordHandler as ReadingRecordHandler} from 'brain/tracker/reading/index'
import Reading from 'brain/tracker/reading/Reading'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PeopleIcon from '@material-ui/icons/People'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
  },
  expanderRoot: {
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

class Live extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.state = {
      expanded: null,
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

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

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
    const {
       expanded,
    } = this.state
    return <div className={classes.root}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className={classes.root}>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Client Filter</Typography>
              <Typography className={classes.secondaryHeading}>Select Clients You'd Like Displayed</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                maximus est, id dignissim quam.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Assets</Typography>
              <Typography className={classes.secondaryHeading}>
                Select the Assets You'd Like Displayed
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
                diam eros in elit. Pellentesque convallis laoreet laoreet.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Map Settings</Typography>
              <Typography className={classes.secondaryHeading}>
                Configure How The Map Looks
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas
                eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
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