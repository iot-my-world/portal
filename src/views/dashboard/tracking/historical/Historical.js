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
  Switch,
  Collapse,
  IconButton,
  Tooltip, CardContent,
  CardHeader, Avatar,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
// import MultiSelect from 'components/multiSelect'
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
import Login from 'brain/security/claims/login/Login'
import {retrieveFromList} from 'brain/search/identifier/utilities'
import BEPTable from 'components/table/bepTable/BEPTable'
import {Text} from 'brain/search/criterion/types'

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
    margin: theme.spacing.unit,
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
  device: 0,
}

class Historical extends Component {
  constructor(props) {
    super(props)
    this.getPartyName = this.getPartyName.bind(this)
    this.loadReport = this.loadReport.bind(this)
    this.renderFilterShowHideIcon = this.renderFilterShowHideIcon.bind(this)
    this.renderFiltersMenu = this.renderFiltersMenu.bind(this)
    this.handleClientFilterChange = this.handleClientFilterChange.bind(this)
    this.handleCompanyFilterChange = this.handleCompanyFilterChange.bind(this)
    this.load = this.load.bind(this)
    this.updateMapViewport = this.updateMapViewport.bind(this)
    this.renderMapPins = this.renderMapPins.bind(this)
    this.getMapHeight = this.getMapHeight.bind(this)
    this.renderMapPinPopup = this.renderMapPinPopup.bind(this)
    this.renderPartySwitch = this.renderPartySwitch.bind(this)
    this.handlePartySwitchChange = this.handlePartySwitchChange.bind(this)
    this.state = {
      expanded: null,
      // showControls: false,
      showControls: true,
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 5,
        bearing: 0,
        pitch: 0,
      },
      mapHeight: 0,
      popupInfo: null,
      readings: [],

      mapPopUpOpen: false,
      selectedReading: new Reading(),

      hideUnassignedDevices: true,

      showAvailableDevicesTable: false,
      showSelectedDevicesTable: false,
    }

    this.entityMap = {
      Company: [],
      Client: [],
      System: [],
    }

    this.systemIdentifiers = []
    this.companyIdentifiers = []
    this.clientIdentifiers = []

    this.readingPinColorMap = {}

    this.loadReportTimeout = () => {
    }
  }

  getPartyName(partyType, partyId) {
    const list = this.entityMap[partyType]
    const entity = retrieveFromList(partyId, list ? list : [])
    return entity ? entity.name : ''
  }

  async load() {
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
      this.entityMap.Company = (await CompanyRecordHandler.Collect()).records
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
    // this.load().then(() => this.loadReport())
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

  handlePartySwitchChange(event) {
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

  renderFiltersMenu() {
    const {classes, maxViewDimensions} = this.props
    const {
      expanded,
      showAvailableDevicesTable,
      showSelectedDevicesTable,
    } = this.state

    return (
        <div className={classes.expanderRoot}>
          <ExpansionPanel
              expanded={expanded === filterPanels.device}
              onChange={this.handleChange(filterPanels.device)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
              <div className={classes.panelInfo}>
                <Typography className={classes.heading}>
                  Device Filter
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Select The Devices You'd Like Displayed
                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                  container
                  direction="column"
                  spacing={8}
                  alignItems="center"
              >
                <Grid item>
                  <Card
                      style={{
                        width: maxViewDimensions.width - 60,
                      }}
                  >
                    <CardHeader
                        avatar={
                          <Avatar aria-label='available'
                                  className={classes.avatar}>
                            R
                          </Avatar>
                        }
                        action={
                          <IconButton
                              onClick={() => this.setState({
                                showSelectedDevicesTable:
                                    !showSelectedDevicesTable,
                              })}
                          >
                            {showSelectedDevicesTable
                                ? <ExpandLessIcon/>
                                : <ExpandMoreIcon/>
                            }
                          </IconButton>
                        }
                        title='Selected'
                        subheader='Devices You Have Selected'
                    />
                    <Collapse in={showSelectedDevicesTable}>
                      <CardContent>
                        <BEPTable
                            loading={false}
                            totalNoRecords={5}
                            noDataText={'No Clients Found'}
                            data={[{}]}
                            onCriteriaQueryChange={() => {
                            }}

                            columns={[
                              {
                                Header: 'Owner Party Type',
                                accessor: 'ownerPartyType',
                                width: 136,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Owned By',
                                accessor: 'ownerId',
                                width: 150,
                                Cell: rowCellInfo => {
                                  try {
                                    return this.getPartyName(
                                        rowCellInfo.original.ownerPartyType,
                                        rowCellInfo.value,
                                    )
                                  } catch (e) {
                                    console.error('error getting owner info', e)
                                    return '-'
                                  }
                                },
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Assigned Party Type',
                                accessor: 'assignedPartyType',
                                width: 160,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Assigned To',
                                accessor: 'assignedId',
                                width: 150,
                                Cell: rowCellInfo => {
                                  try {
                                    return this.getPartyName(
                                        rowCellInfo.original.assignedPartyType,
                                        rowCellInfo.value,
                                    )
                                  } catch (e) {
                                    console.error('error getting assigned info',
                                        e)
                                    return '-'
                                  }
                                },
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Sim Country Code',
                                accessor: 'simCountryCode',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Sim Number',
                                accessor: 'simNumber',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Manufacturer Id',
                                accessor: 'manufacturerId',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                            ]}
                        />
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
                <Grid item>
                  <Card
                      style={{
                        width: maxViewDimensions.width - 60,
                      }}
                  >
                    <CardHeader
                        avatar={
                          <Avatar aria-label='available'
                                  className={classes.avatar}>
                            R
                          </Avatar>
                        }
                        action={
                          <IconButton
                              onClick={() => this.setState({
                                showAvailableDevicesTable:
                                    !showAvailableDevicesTable,
                              })}
                          >
                            {showAvailableDevicesTable
                                ? <ExpandLessIcon/>
                                : <ExpandMoreIcon/>
                            }
                          </IconButton>
                        }
                        title='Available'
                        subheader='Devices That You Can Select'
                    />
                    <Collapse in={showAvailableDevicesTable}>
                      <CardContent>
                        <BEPTable
                            loading={false}
                            totalNoRecords={5}
                            noDataText={'No Clients Found'}
                            data={[{}]}
                            onCriteriaQueryChange={() => {
                            }}

                            columns={[
                              {
                                Header: 'Owner Party Type',
                                accessor: 'ownerPartyType',
                                width: 136,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Owned By',
                                accessor: 'ownerId',
                                width: 150,
                                Cell: rowCellInfo => {
                                  try {
                                    return this.getPartyName(
                                        rowCellInfo.original.ownerPartyType,
                                        rowCellInfo.value,
                                    )
                                  } catch (e) {
                                    console.error('error getting owner info', e)
                                    return '-'
                                  }
                                },
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Assigned Party Type',
                                accessor: 'assignedPartyType',
                                width: 160,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Assigned To',
                                accessor: 'assignedId',
                                width: 150,
                                Cell: rowCellInfo => {
                                  try {
                                    return this.getPartyName(
                                        rowCellInfo.original.assignedPartyType,
                                        rowCellInfo.value,
                                    )
                                  } catch (e) {
                                    console.error('error getting assigned info',
                                        e)
                                    return '-'
                                  }
                                },
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Sim Country Code',
                                accessor: 'simCountryCode',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Sim Number',
                                accessor: 'simNumber',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                              {
                                Header: 'Manufacturer Id',
                                accessor: 'manufacturerId',
                                width: 150,
                                config: {
                                  filter: {
                                    type: Text,
                                  },
                                },
                              },
                            ]}
                        />
                      </CardContent>
                    </Collapse>
                  </Card>
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

  getMapHeight(element) {
    try {
      if (element) {
        this.setState({mapHeight: element.clientHeight - 10})
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

  renderPartySwitch() {
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

  renderFilterShowHideIcon() {
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
    const {classes, maxViewDimensions} = this.props
    const {viewport, mapHeight, showControls} = this.state

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
            <Card
                style={{
                  width: maxViewDimensions.width - 20,
                }}
            >
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
                width={maxViewDimensions.width - 20}
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
  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(Login),
  /**
   * my party entity
   */
  party: PropTypes.object.isRequired,
  /**
   * max view dimensions from redux {width: x, height: x}
   */
  maxViewDimensions: PropTypes.object.isRequired,
}
Historical.defaultProps = {}

export default Historical
