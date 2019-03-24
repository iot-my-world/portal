import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Typography,
  ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary, Grid,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MultiSelect from 'components/multiSelect'
import {FullPageLoader} from 'components/loader/index'
import {CompanyRecordHandler} from 'brain/party/company'
import {ClientRecordHandler} from 'brain/party/client'
import {TrackingReport} from 'brain/report/tracking'
import MapGL,
{
  Marker,
  // Popup,
  // NavigationControl,
} from 'react-map-gl'
import 'components/mapbox/Custom.css'
import {MapPin} from './map'

const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

const styles = theme => ({
  root: {
    height: '100%',
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
  map: {},
})

// const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

/**
 * returns a random color
 * @param {string[]} [exclude] - colors to exclude
 * @returns {string}
 */
function getRandomColor(exclude = []) {
  const letters = '0123456789ABCDEF'
  let color = '#'
  let firstTime = true
  while (exclude.includes(color) || firstTime) {
    firstTime = false
    color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
  }

  return color
}

const filterPanels = {
  company: 0,
  client: 1,
}

class Historical extends Component {

  constructor(props) {
    super(props)
    this.loadReport = this.loadReport.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.handleClientFilterChange = this.handleClientFilterChange.bind(this)
    this.handleCompanyFilterChange =
        this.handleCompanyFilterChange.bind(this)
    this.load = this.load.bind(this)
    this.updateMapViewport = this.updateMapViewport.bind(this)
    this.renderDeviceLocations = this.renderDeviceLocations.bind(this)
    this.getMapDimensions = this.getMapDimensions.bind(this)
    this.state = {
      expanded: null,
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 3.5,
        bearing: 0,
        pitch: 0,
      },
      mapDimensions: {
        width: 0,
        height: 0,
      },
      popupInfo: null,
      loading: false,
      readings: [],
    }
    this.companies = []
    this.clients = []

    this.companyIdentifiers = []
    this.clientIdentifiers = []

    this.readingPinColorMap = {}

    this.loadReportTimeout = () => {
    }
  }

  async load() {
    this.setState({loading: true})
    try {
      this.companies = (await CompanyRecordHandler.Collect()).records
      this.companyIdentifiers =
          this.companies.map(company => company.identifier)
    } catch (e) {
      console.error('error collecting companies', e)
      return
    }
    try {
      this.clients = (await ClientRecordHandler.Collect()).records
      this.clientIdentifiers =
          this.clients.map(client => client.identifier)
    } catch (e) {
      console.error('error collecting clients', e)
      return
    }
    this.setState({loading: false})
  }

  componentDidMount() {
    // this.load().then(() => this.loadReport())
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      expanded: prevExpanded,
    } = prevState
    const {
      expanded,
    } = this.state
    if (
        (expanded !== prevExpanded) &&
        (expanded !== null)
    ) {
    }
  }

  async loadReport() {
    this.setState({loading: true})
    try {
      this.setState({
        readings: (await TrackingReport.Live({
          companyIdentifiers: this.companyIdentifiers,
          clientIdentifiers: this.clientIdentifiers,
        })).readings,
      })
      let usedColors = Object.values(this.readingPinColorMap)
      this.state.readings.forEach(reading => {
        if (this.readingPinColorMap[reading.id] === undefined) {
          // if a color has not yet been assigned for this reading id then
          // assign one now
          const fill = getRandomColor(usedColors)
          usedColors.push(fill)
          this.readingPinColorMap[reading.id] = fill
        }
      })
    } catch (e) {
      console.error('error loading report', e)
    }
    this.setState({loading: false})
  }

  handleClientFilterChange(selected) {
    this.clientIdentifiers = selected.map(client => client.identifier)
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  handleCompanyFilterChange(selected) {
    this.companyIdentifiers = selected.map(company => company.identifier)
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  renderFiltersMenu() {
    const {classes} = this.props
    const {expanded} = this.state

    return <div className={classes.root}>
      <ExpansionPanel expanded={expanded === filterPanels.client}
                      onChange={this.handleChange(filterPanels.client)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Company Filter</Typography>
          <Typography className={classes.secondaryHeading}>
            Select Companies You'd Like Displayed
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid
              container
              direction='column'
              spacing={8}
              alignItems='center'
          >
            <Grid item>
              <MultiSelect
                  displayAccessor='name'
                  uniqueIdAccessor='id'
                  selected={this.companies}
                  available={[]}
                  onChange={this.handleCompanyFilterChange}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === filterPanels.company}
                      onChange={this.handleChange(filterPanels.company)}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>Client Filter</Typography>
          <Typography className={classes.secondaryHeading}>
            Select Clients You'd Like Displayed
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid
              container
              direction='column'
              spacing={8}
              alignItems='center'
          >
            <Grid item>
              <MultiSelect
                  displayAccessor='name'
                  uniqueIdAccessor='id'
                  selected={this.clients}
                  available={[]}
                  onChange={this.handleClientFilterChange}
              />
            </Grid>
          </Grid>
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

  updateMapViewport = (viewport) => {
    this.setState({viewport})
  }

  getMapDimensions(element) {
    try {
      if (element) {
        this.setState({
          mapDimensions: {
            width: element.clientWidth,
            height: element.clientHeight,
          },
        })
      }
    } catch (e) {
      console.error('error getting map dimensions', e)
    }
  }

  renderDeviceLocations() {
    const {
      readings,
    } = this.state

    return readings.map((reading, idx) => {
      return <Marker
          key={`marker-${idx}`}
          longitude={reading.longitude}
          latitude={reading.latitude}>
        <MapPin
            style={{
              ...MapPin.defaultProps.style,
              fill: this.readingPinColorMap[reading.id],
            }}
        />
      </Marker>
    })
  }

  render() {
    const {
      classes,
    } = this.props
    const {
      loading,
      viewport,
      mapDimensions,
    } = this.state

    return (
        <div
            id={'historicalTrackingDashboardRoot'}
            className={classes.root}
        >
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {this.renderFiltersMenu()}
          </div>
          <div
              className={classes.map}
              ref={this.getMapDimensions}
          >
            <MapGL
                {...viewport}
                width={mapDimensions.width}
                height={mapDimensions.height}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this.updateMapViewport}
                mapboxApiAccessToken={TOKEN}
            >
              {this.renderDeviceLocations()}
            </MapGL>
          </div>
          <FullPageLoader open={loading}/>
        </div>
    )
  }
}

Historical = withStyles(styles)(Historical)

Historical.propTypes = {
  /**
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
}
Historical.defaultProps = {}

export default Historical