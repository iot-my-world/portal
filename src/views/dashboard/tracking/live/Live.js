import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MultiSelect from 'components/multiSelect'
import {CompanyRecordHandler} from 'brain/party/company'
import {ClientRecordHandler} from 'brain/party/client'
import {TrackingReport} from 'brain/report/tracking'
import MapGL, {
  Marker,
  // Popup,
  // NavigationControl,
} from 'react-map-gl'
import 'components/mapbox/Custom.css'
import {MapPin, MapPinPopup} from './map'
import {Reading} from 'brain/tracker/reading'
import {SystemRecordHandler} from 'brain/party/system'
import {PartyIdentifier} from 'brain/search/identifier'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'

const TOKEN =
    'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

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
  map: {
    padding: 10,
  },
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

class Live extends Component {
  constructor(props) {
    super(props)
    this.loadReport = this.loadReport.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.handleClientFilterChange = this.handleClientFilterChange.bind(this)
    this.handleCompanyFilterChange = this.handleCompanyFilterChange.bind(this)
    this.load = this.load.bind(this)
    this.updateMapViewport = this.updateMapViewport.bind(this)
    this.renderMapPins = this.renderMapPins.bind(this)
    this.getMapDimensions = this.getMapDimensions.bind(this)
    this.renderMapPinPopup = this.renderMapPinPopup.bind(this)
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
      readings: [],

      mapPopUpOpen: false,
      selectedReading: new Reading(),
    }
    this.systems = []
    this.companies = []
    this.clients = []

    this.systemIdentifiers = []
    this.companyIdentifiers = []
    this.clientIdentifiers = []

    this.readingPinColorMap = {}

    this.loadReportTimeout = () => {
    }
  }

  async load() {
    const {ShowGlobalLoader, HideGlobalLoader} = this.props
    ShowGlobalLoader()
    try {
      this.systems = (await SystemRecordHandler.Collect()).records
      this.systemIdentifiers = this.systems.map(
          system =>
              new PartyIdentifier({
                partyType: SystemPartyType,
                partyIdIdentifier: system.id,
              }),
      )
    } catch (e) {
      console.error('error collecting system', e)
      return
    }
    try {
      this.companies = (await CompanyRecordHandler.Collect()).records
      this.companyIdentifiers = this.companies.map(
          company =>
              new PartyIdentifier({
                partyType: CompanyPartyType,
                partyIdIdentifier: company.id,
              }),
      )
    } catch (e) {
      console.error('error collecting companies', e)
      return
    }
    try {
      this.clients = (await ClientRecordHandler.Collect()).records
      this.clientIdentifiers = this.clients.map(
          client =>
              new PartyIdentifier({
                partyType: ClientPartyType,
                partyIdIdentifier: client.id,
              }),
      )
    } catch (e) {
      console.error('error collecting clients', e)
      return
    }
    HideGlobalLoader()
  }

  componentDidMount() {
    this.load().then(() => this.loadReport())
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {expanded: prevExpanded} = prevState
    const {expanded} = this.state
    if (expanded !== prevExpanded && expanded !== null) {
    }
  }

  async loadReport() {
    const {ShowGlobalLoader, HideGlobalLoader} = this.props
    ShowGlobalLoader()
    try {
      this.setState({
        readings: (await TrackingReport.Live({
          partyIdentifiers: [
            ...this.companyIdentifiers,
            ...this.clientIdentifiers,
            ...this.systemIdentifiers,
          ],
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
    HideGlobalLoader()
  }

  handleClientFilterChange(selected) {
    this.clientIdentifiers = selected.map(
        client =>
            new PartyIdentifier({
              partyType: ClientPartyType,
              partyIdIdentifier: client.id,
            }),
    )
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  handleCompanyFilterChange(selected) {
    this.companyIdentifiers = selected.map(
        company =>
            new PartyIdentifier({
              partyType: CompanyPartyType,
              partyIdIdentifier: company.id,
            }),
    )
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  renderFiltersMenu() {
    const {classes} = this.props
    const {expanded} = this.state

    return (
        <div className={classes.root}>
          <ExpansionPanel
              expanded={expanded === filterPanels.client}
              onChange={this.handleChange(filterPanels.client)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>
                Company Filter
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Select Companies You'd Like Displayed
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                  container
                  direction="column"
                  spacing={8}
                  alignItems="center"
              >
                <Grid item>
                  <MultiSelect
                      displayAccessor="name"
                      uniqueIdAccessor="id"
                      selected={this.companies}
                      available={[]}
                      onChange={this.handleCompanyFilterChange}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
              expanded={expanded === filterPanels.company}
              onChange={this.handleChange(filterPanels.company)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>
                Client Filter
              </Typography>
              <Typography className={classes.secondaryHeading}>
                Select Clients You'd Like Displayed
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                  container
                  direction="column"
                  spacing={8}
                  alignItems="center"
              >
                <Grid item>
                  <MultiSelect
                      displayAccessor="name"
                      uniqueIdAccessor="id"
                      selected={this.clients}
                      available={[]}
                      onChange={this.handleClientFilterChange}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
    )
  }

  updateMapViewport = viewport => {
    this.setState({viewport})
  }

  getMapDimensions(element) {
    try {
      if (element) {
        this.setState({
          mapDimensions: {
            width: element.clientWidth,
            height: element.clientHeight - 10,
          },
        })
      }
    } catch (e) {
      console.error('error getting map dimensions', e)
    }
  }

  renderMapPins() {
    const {readings} = this.state

    return readings.map((reading, idx) => {
      return (
          <Marker
              key={`marker-${idx}`}
              longitude={reading.longitude}
              latitude={reading.latitude}
          >
            <MapPin
                style={{
                  ...MapPin.defaultProps.style,
                  fill: this.readingPinColorMap[reading.id],
                }}
                onClick={() => this.setState({
                  selectedReading: reading,
                  mapPopUpOpen: true,
                })}
            />
          </Marker>
      )
    })
  }

  renderMapPinPopup() {
    const {selectedReading, mapPopUpOpen} = this.state

    return (
        <MapPinPopup
            open={mapPopUpOpen}
            tipSize={5}
            anchor="top"
            reading={selectedReading}
            longitude={selectedReading.longitude}
            latitude={selectedReading.latitude}
            closeOnClick={false}
            onClose={() => this.setState({
              mapPopUpOpen: false,
            })}
        />
    )
  }

  render() {
    const {classes} = this.props
    const {viewport, mapDimensions} = this.state

    return (
        <div
            id={'liveTrackingDashboardRoot'}
            className={classes.root}
        >
          <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
          >
            <Card>
              <CardContent>
                <Grid container>
                  <Grid item>
                    {this.renderFiltersMenu()}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
          <div className={classes.map} ref={this.getMapDimensions}>
            <MapGL
                {...viewport}
                width={mapDimensions.width}
                height={mapDimensions.height}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={this.updateMapViewport}
                mapboxApiAccessToken={TOKEN}
            >
              {this.renderMapPins()}
              {this.renderMapPinPopup()}
            </MapGL>
          </div>
        </div>
    )
  }
}

Live = withStyles(styles)(Live)

Live.propTypes = {
  /**
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
}
Live.defaultProps = {}

export default Live
