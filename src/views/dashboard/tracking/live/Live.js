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
  Switch, Divider,
  Collapse,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
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
import ZX303TrackerGPSReading from 'brain/tracker/zx303/reading/gps'
import {SystemRecordHandler} from 'brain/party/system'
import {PartyIdentifier} from 'brain/search/identifier'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import {HumanUserLoginClaims} from 'brain/security/claims'
import {retrieveFromList} from 'brain/search/identifier/utilities'

const TOKEN =
    'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'

const styles = theme => ({
  root: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
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
  panelInfo: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
  },
  map: {
    padding: 10,
  },
  partySwitchWrapper: {
    margin: 2,
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
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
  other: 2,
}

class Live extends Component {
  constructor(props) {
    super(props)
    this.viewCompanyFilter =
        (props.claims.partyType === SystemPartyType)
    this.viewClientFilter =
        (props.claims.partyType === SystemPartyType) ||
        (props.claims.partyType === CompanyPartyType)
  }


  entityMap = {
    Company: [],
    Client: [],
    System: [],
  }

  systemIdentifiers = []
  companyIdentifiers = []
  clientIdentifiers = []

  readingPinColorMap = {}

  loadReportTimeout = () => {
  }

  state = {
    expanded: null,
    showControls: false,
    viewport: {
      latitude: -26.046573,
      longitude: 28.095451,
      zoom: 5,
      bearing: 0,
      pitch: 0,
    },
    mapHeight: 0,
    mapWidth: 0,
    popupInfo: null,
    readings: [],

    mapPopUpOpen: false,
    selectedReading: new ZX303TrackerGPSReading(),

    hideUnassignedDevices: true,
  }  

  getPartyName = (partyType, partyId) => {
    const list = this.entityMap[partyType]
    const entity = retrieveFromList(partyId, list ? list : [])
    return entity ? entity.name : ''
  }

  load = async () => {
    const {ShowGlobalLoader, HideGlobalLoader, claims} = this.props
    ShowGlobalLoader()
    try {
      this.entityMap.System = (await SystemRecordHandler.Collect()).records
      this.systemIdentifiers = this.entityMap.System.map(
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
      this.entityMap.Human = (await CompanyRecordHandler.Collect()).records
      this.companyIdentifiers = this.entityMap.Company.map(
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
      this.entityMap.Client = (await ClientRecordHandler.Collect()).records
      this.clientIdentifiers = this.entityMap.Client.map(
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

    // remove my party from applicable list. this is because by default
    // hideUnassignedDevices is set to false
    switch (claims.partyType) {
      case SystemPartyType:
        this.systemIdentifiers = this.systemIdentifiers.filter(identifier =>
            identifier.partyIdIdentifier.id !== claims.partyId.id,
        )
        break

      case CompanyPartyType:
        this.companyIdentifiers = this.companyIdentifiers.filter(identifier =>
            identifier.partyIdIdentifier.id !== claims.partyId.id,
        )
        break

      default:
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

  loadReport = async () => {
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
        })).zx303TrackerGPSReadings,
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

  handleClientFilterChange = (selected) => {
    this.clientIdentifiers = selected.map(
        client =>
            new PartyIdentifier({
              partyType: ClientPartyType,
              partyIdIdentifier: client.id,
            }),
    )
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  handleCompanyFilterChange = (selected) => {
    this.companyIdentifiers = selected.map(
        company =>
            new PartyIdentifier({
              partyType: CompanyPartyType,
              partyIdIdentifier: company.id,
            }),
    )
    this.loadReportTimeout = setTimeout(this.loadReport, 500)
  }

  handlePartySwitchChange = (event) => {
    const {claims} = this.props
    this.setState({hideUnassignedDevices: event.target.checked})

    switch (claims.partyType) {
      case SystemPartyType:
        if (event.target.checked) {
          // just checked, so remove party
          this.systemIdentifiers = this.systemIdentifiers.filter(identifier =>
              identifier.partyIdIdentifier.id !== claims.partyId.id,
          )
        } else {
          // just unchecked, add party
          this.systemIdentifiers.push(new PartyIdentifier({
            partyType: claims.partyType,
            partyIdIdentifier: claims.partyId.id,
          }))
        }
        break

      case CompanyPartyType:
        if (event.target.checked) {
          // just checked, so remove party
          this.companyIdentifiers = this.companyIdentifiers.filter(identifier =>
              identifier.partyIdIdentifier.id !== claims.partyId.id,
          )
        } else {
          // just unchecked, add party
          this.companyIdentifiers.push(new PartyIdentifier({
            partyType: claims.partyType,
            partyIdIdentifier: claims.partyId.id,
          }))
        }
        break

      default:
    }
    this.loadReportTimeout = setTimeout(this.loadReport, 100)
  }

  renderFiltersMenu = () => {
    const {classes} = this.props
    const {expanded} = this.state

    return (
        <div className={classes.expanderRoot}>
          {this.viewCompanyFilter &&
          <ExpansionPanel
              expanded={expanded === filterPanels.client}
              onChange={this.handleChange(filterPanels.client)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <div className={classes.panelInfo}>
                <Typography className={classes.heading}>
                  Company Filter
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Select Companies You'd Like Displayed
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                  container
                  direction="column"
                  spacing={1}
                  alignItems="center"
              >
                <Grid item>
                  <MultiSelect
                      displayAccessor="name"
                      uniqueIdAccessor="id"
                      selected={this.entityMap.Company}
                      available={[]}
                      onChange={this.handleCompanyFilterChange}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>}
          {this.viewClientFilter &&
          <ExpansionPanel
              expanded={expanded === filterPanels.company}
              onChange={this.handleChange(filterPanels.company)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <div className={classes.panelInfo}>
                <Typography className={classes.heading}>
                  Client Filter
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Select Clients You'd Like Displayed
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                  container
                  direction="column"
                  spacing={1}
                  alignItems="center"
              >
                <Grid item>
                  <MultiSelect
                      displayAccessor="name"
                      uniqueIdAccessor="id"
                      selected={this.entityMap.Client}
                      available={[]}
                      onChange={this.handleClientFilterChange}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>}
          <ExpansionPanel
              expanded={expanded === filterPanels.other}
              onChange={this.handleChange(filterPanels.other)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <div className={classes.panelInfo}>
                <Typography className={classes.heading}>
                  Other
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Additional Filter Options
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Divider/>
              {this.renderPartySwitch()}
              <Divider/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
    )
  }

  updateMapViewport = viewport => {
    this.setState({viewport})
  }

  getMapHeight = (element) => {
    try {
      if (element) {
        console.log(element.parentElement.clientWidth)
        this.setState({
          mapHeight: element.parentElement.clientHeight + 400,
          mapWidth: element.parentElement.clientWidth - 10,
        })
      }
    } catch (e) {
      console.error('error getting map dimensions', e)
    }
  }

  renderMapPins = () => {
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

  renderMapPinPopup = () => {
    const {selectedReading, mapPopUpOpen} = this.state

    return (
        <MapPinPopup
            open={mapPopUpOpen}
            tipSize={5}
            anchor="top"
            getPartyName={this.getPartyName}
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

  renderPartySwitch = () => {
    const {claims, classes, party} = this.props

    let msg = ''
    switch (claims.partyType) {
      case SystemPartyType:
        msg = 'hide devices owned by system that are not assigned'
        break
      case CompanyPartyType:
        msg = `hide devices owned by ${party.name} that are not assigned to any clients`
        break
      default:
        return
    }
    const {hideUnassignedDevices} = this.state

    return (
        <Grid item>
          <div className={classes.partySwitchWrapper}>
            <div>
              <Typography>
                Hide Unassigned
              </Typography>
            </div>
            <div>
              <Switch
                  checked={hideUnassignedDevices}
                  onChange={this.handlePartySwitchChange}
              />
            </div>
            <div style={{gridColumn: '1/3'}}>
              <Typography variant={'caption'}>
                {msg}
              </Typography>
            </div>
          </div>
        </Grid>
    )
  }

  renderFilterShowHideIcon = () => {
    const {classes} = this.props
    const {showControls} = this.state
    if (showControls) {
      return (
          <Tooltip
              title='Hide Filters'
              placement={'right'}
          >
            <IconButton
                onClick={() => this.setState({showControls: !showControls})}
                className={classes.button} aria-label='collapse'
            >
              <ExpandLessIcon/>
            </IconButton>
          </Tooltip>
      )
    } else {
      return (
          <Tooltip
              title='Show Filters'
              placement={'right'}
          >
            <IconButton
                onClick={() => this.setState({showControls: !showControls})}
                className={classes.button} aria-label='expand'
            >
              <ExpandMoreIcon/>
            </IconButton>
          </Tooltip>
      )
    }
  }

  render() {
    const {classes} = this.props
    const {viewport, mapHeight, mapWidth, showControls} = this.state

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
              <Grid container direction={'column'} alignItems={'center'}>
                <Grid item>
                  {this.renderFilterShowHideIcon()}
                </Grid>
                <Grid item>
                  <Collapse in={showControls}>
                    {this.renderFiltersMenu()}
                  </Collapse>
                </Grid>
              </Grid>
            </Card>
          </div>
          <div className={classes.map} ref={this.getMapHeight}>
            <MapGL
                {...viewport}
                width={mapWidth}
                height={mapHeight}
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
  /**
   * HumanUserLoginClaims claims from redux state
   */
  claims: PropTypes.instanceOf(HumanUserLoginClaims),
  /**
   * my party entity
   */
  party: PropTypes.object.isRequired,
}
Live.defaultProps = {}

export default Live
