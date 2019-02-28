import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Grid, Typography, TextField,
  ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary, Avatar, Chip,
  Card, CardContent,
} from '@material-ui/core'
import Query from 'brain/search/Query'
import {RecordHandler as ReadingRecordHandler} from 'brain/tracker/reading/index'
import Reading from 'brain/tracker/reading/Reading'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DoneIcon from '@material-ui/icons/Done'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
  },
  expanderRoot: {},
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  // select component styles
  selectRoot: {padding: 10},
  availableRoot: {},
  availableWindow: {
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  selectedRoot: {},
  selectedWindow: {
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  chipWrapper: {
    padding: 2,
  },
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

class Live extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.state = {
      // expanded: null,
      expanded: 'panel1',
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
    })
  }

  async collect() {
    const newQuery = new Query()
    newQuery.limit = 0

    let collectReadingsResponse
    try {
      collectReadingsResponse = await ReadingRecordHandler.Collect([], newQuery)
    } catch (e) {
      console.error('error collecting readings', e)
    }

    const readings = collectReadingsResponse.records.map(
        reading => new Reading(reading))
    console.log(readings)

    this.setState({
      isLoading: false,
      locationData: readings,
    })
  }

  renderFiltersMenu() {
    const {classes} = this.props
    const {expanded} = this.state
    return <div className={classes.root}>
      <ExpansionPanel expanded={expanded === 'panel1'}
                      onChange={this.handleChange('panel1')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Client Filter</Typography>
          <Typography className={classes.secondaryHeading}>Select Clients You'd
            Like Displayed</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.selectRoot}>
            <Card>
              <CardContent>
                <Grid container spacing={8}>
                  <Grid item>
                    <div className={classes.availableRoot}>
                      <TextField/>
                      <div className={classes.availableWindow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(thing => {
                          return <div key={thing}
                                      className={classes.chipWrapper}>
                            <Chip
                                label='monteagle'
                                color='primary'
                                avatar={<Avatar><DoneIcon/></Avatar>}
                                clickable
                                onClick={() => console.log('clicked!!!!')}
                            />
                          </div>
                        })}
                      </div>
                    </div>
                  </Grid>
                  <Grid item>
                    <div className={classes.selectedRoot}>
                      <TextField/>
                      <div className={classes.selectedWindow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(thing => {
                          return <div key={thing}
                                      className={classes.chipWrapper}>
                            <Chip
                                label='monteagle'
                                color='primary'
                                avatar={<Avatar><DoneIcon/></Avatar>}
                                clickable
                                onClick={() => console.log('clicked!!!!')}
                            />
                          </div>
                        })}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel2'}
                      onChange={this.handleChange('panel2')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Assets</Typography>
          <Typography className={classes.secondaryHeading}>
            Select the Assets You'd Like Displayed
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'panel3'}
                      onChange={this.handleChange('panel3')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Map Settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Configure How The Map Looks
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas
            eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  }

  render() {
    const {
      classes,
    } = this.props
    return <div className={classes.root}>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {this.renderFiltersMenu()}
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