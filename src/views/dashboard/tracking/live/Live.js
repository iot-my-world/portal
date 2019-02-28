import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core'
import Query from 'brain/search/Query'
import {RecordHandler as ReadingRecordHandler} from 'brain/tracker/reading'
import {RecordHandler as ClientRecordHandler} from 'brain/party/client'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MultiSelect from 'components/multiSelect'
import {FullPageLoader} from 'components/loader/index'
import {
  RecordHandler as CompanyRecordHandler,
} from 'brain/party/company'

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
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  selectedRoot: {},
  selectedWindow: {
    backgroundColor: '#f2f2f2',
    boxShadow: 'inset 0 0 4px #000000',
    height: 120,
    padding: 5,
    overflow: 'auto',
  },
  chip: {},
  chipWrapper: {
    padding: 2,
  },
  searchField: {
    width: '100%',
  },
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

class Live extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.load = this.load.bind(this)
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
      loading: true,
    }
    this.companies = []
    this.clients = []
    this.collectCriteria = []
    this.collectQuery = new Query()
  }

  async load() {
    this.setState({loading: true})
    try {
      this.companies = (await CompanyRecordHandler.Collect()).records
    } catch (e) {
      console.error('error collecting companies', e)
      return
    }
    try {
      this.clients = (await ClientRecordHandler.Collect()).records
    } catch (e) {
      console.error('error collecting clients', e)
      return
    }
    this.setState({loading: false})
  }

  componentDidMount() {
    this.load().then(() => this.collect())
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  async collect() {
    let collectReadingsResponse
    try {
      collectReadingsResponse = await ReadingRecordHandler.Collect(this.collectCriteria)
    } catch (e) {
      console.error('error collecting readings', e)
    }
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
          <MultiSelect
              displayAccessor='name'
              uniqueIdAccessor='id'
              selected={[
                {id: 0, name: 'Monteagle Logistics'},
                {id: 1, name: 'Spar'},
              ]}
              available={[
                {id: 2, name: 'Omni'},
                {id: 3, name: 'Woolworths'},
              ]}
              onChange={(selected, available) => console.log('change!',
                  selected, available)}
          />
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
    const {loading} = this.state
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
      <FullPageLoader open={loading}/>
    </div>
  }
}

Live = withStyles(styles)(Live)

Live.propTypes = {}
Live.defaultProps = {}

export default Live