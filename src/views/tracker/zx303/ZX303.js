import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Card, CardContent, Tooltip,
  IconButton, Icon,
} from '@material-ui/core'
import ZX303TrackerDetailDialogContainer
  from 'components/tracker/zx303/Detail/DetailContainer'
import ZX303TrackerBatteryLifeDialogContainer
  from 'components/tracker/zx303/BatteryLifeTrendDialog/BatteryLifeDialogContainer'
import {activeStates as zx303TrackerDetailDialogActiveStates} from 'components/tracker/zx303/Detail/Detail'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import {ZX303 as ZX303Device} from 'brain/tracker/zx303/index'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import ZX303DeviceRecordHandler from 'brain/tracker/zx303/RecordHandler'
import {TextCriterionType} from 'brain/search/criterion/types'
import BEPTable from 'components/table/bepTable/BEPTable'
import {
  FaGlasses as ViewDetailsIcon,
  FaPlus as AddNewIcon,
  FaBatteryFull as BatteryLifeIcon,
  FaSyncAlt as ReloadIcon,
} from 'react-icons/fa'
import moment from 'moment'

const styles = theme => ({
  root: {},
  tableWrapper: {
    overflow: 'auto',
  },
})

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

class ZX303 extends Component {
  state = {
    activeState: events.init,

    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,

    zx303DeviceEntity: new ZX303Device(),

    detailDialogOpen: false,
    initialDetailDialogActiveState:
    zx303TrackerDetailDialogActiveStates.viewingExisting,

    batteryLifeDialogOpen: false,
  }

  partyHolder = new PartyHolder()
  collectTimeout = () => {
  }
  collectCriteria = []
  collectQuery = new Query()

  componentDidMount() {
    this.collect()
  }

  collect = async () => {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props
    this.setState({recordCollectionInProgress: true})
    // perform device collection
    let collectResponse
    try {
      collectResponse = await ZX303DeviceRecordHandler.Collect(
        this.collectCriteria,
        this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching ZX303 devices', e)
      NotificationFailure('Error Fetching ZX303 devices', e)
      return
    }

    try {
      await this.partyHolder.load(
        collectResponse.records,
        'ownerPartyType',
        'ownerId',
      )
      await this.partyHolder.load(
        collectResponse.records,
        'assignedPartyType',
        'assignedId',
      )
      this.partyHolder.update(
        party,
        claims.partyType,
      )
    } catch (e) {
      console.error('Error Loading Associated Parties', e)
      NotificationFailure('Error Loading Associated Parties')
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCreateNew = () => {
    this.setState({
      selectedRowIdx: -1,
      zx303DeviceEntity: new ZX303Device(),
      initialDetailDialogActiveState:
      zx303TrackerDetailDialogActiveStates.editingNew,
      detailDialogOpen: true
    })
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      zx303DeviceEntity: new ZX303Device(),
      selectedRowIdx: -1,
    })
  }

  handleSelect = (rowObj, rowIdx) => {
    this.setState({
      selectedRowIdx: rowIdx,
      zx303DeviceEntity: new ZX303Device(rowObj),
      activeState: events.selectRow,
    })
  }

  getAdditionalTableIcons = () => {
    const {activeState} = this.state
    let additionalIcons = [
      (
        <IconButton
          onClick={this.handleCreateNew}
        >
          <Tooltip
            title={'Add New'}
            placement={'top'}
          >
            <Icon>
              <AddNewIcon/>
            </Icon>
          </Tooltip>
        </IconButton>
      ),
      (
        <IconButton
          onClick={this.collect}
        >
          <Tooltip
            title={'Reload'}
            placement={'top'}
          >
            <Icon>
              <ReloadIcon/>
            </Icon>
          </Tooltip>
        </IconButton>
      ),
    ]

    if (activeState === states.itemSelected) {
      additionalIcons = [
        (<IconButton
          onClick={() => this.setState({
            batteryLifeDialogOpen: true,
          })}
        >
          <Tooltip
            title={'Batter Life Trend'}
            placement={'top'}
          >
            <Icon>
              <BatteryLifeIcon/>
            </Icon>
          </Tooltip>
        </IconButton>),
        (<IconButton
          onClick={() => this.setState({
            detailDialogOpen: true,
            initialDetailDialogActiveState:
            zx303TrackerDetailDialogActiveStates.viewingExisting,
          })}
        >
          <Tooltip
            title={'View Details'}
            placement={'top'}
          >
            <Icon>
              <ViewDetailsIcon/>
            </Icon>
          </Tooltip>
        </IconButton>),
        ...additionalIcons,
      ]
    }
    return additionalIcons
  }

  render() {
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
      initialDetailDialogActiveState,
      detailDialogOpen,
      zx303DeviceEntity,

      batteryLifeDialogOpen,
    } = this.state
    const {
      theme,
      classes,
    } = this.props

    return (
      <div className={classes.root}>
        <Card>
          <CardContent>
            <BEPTable
              loading={recordCollectionInProgress}
              totalNoRecords={totalNoRecords}
              noDataText={'No Devices Found'}
              data={records}
              onCriteriaQueryChange={this.handleCriteriaQueryChange}
              additionalControls={this.getAdditionalTableIcons()}
              columns={[
                {
                  Header: 'Sim Number',
                  accessor: 'simNumber',
                  width: 120,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Logged In',
                  accessor: 'loggedIn',
                  width: 90,
                  Cell: rowInfo => {
                    if (rowInfo.value) {
                      return <div>Yes</div>
                    }
                    return <div>No</div>
                  },
                  filterable: false,
                },
                {
                  Header: 'Heartbeat @',
                  accessor: 'lastHeartbeatTimestamp',
                  width: 105,
                  Cell: rowInfo => {
                    if (rowInfo.value === 0) {
                      return '-'
                    }
                    return moment.unix(rowInfo.value).format('YYYY-MM-DD HH:mm:ss')
                  },
                  filterable: false,
                },
                {
                  Header: 'Login @',
                  accessor: 'logInTimestamp',
                  width: 90,
                  Cell: rowInfo => {
                    if (rowInfo.value === 0) {
                      return '-'
                    }
                    return moment.unix(rowInfo.value).format('YYYY-MM-DD HH:mm:ss')
                  },
                  filterable: false,
                },
                {
                  Header: 'Logout @',
                  accessor: 'logOutTimestamp',
                  width: 90,
                  Cell: rowInfo => {
                    if (rowInfo.value === 0) {
                      return '-'
                    }
                    return moment.unix(rowInfo.value).format('YYYY-MM-DD HH:mm:ss')
                  },
                  filterable: false,
                },
                {
                  Header: 'IMEI',
                  accessor: 'imei',
                  width: 165,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Owner Party Type',
                  accessor: 'ownerPartyType',
                  width: 155,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Owned By',
                  accessor: 'ownerId',
                  Cell: rowInfo => {
                    return this.partyHolder.retrieveEntityProp(
                      'name',
                      rowInfo.value,
                    )
                  },
                  width: 150,
                  filterable: false,
                },
                {
                  Header: 'Assigned Party Type',
                  accessor: 'assignedPartyType',
                  width: 170,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
                {
                  Header: 'Assigned To',
                  accessor: 'assignedId',
                  Cell: rowInfo => {
                    return this.partyHolder.retrieveEntityProp(
                      'name',
                      rowInfo.value,
                    )
                  },
                  width: 150,
                  filterable: false,
                },
                {
                  Header: 'Sim Country Code',
                  accessor: 'simCountryCode',
                  width: 150,
                  config: {
                    filter: {
                      type: TextCriterionType,
                    },
                  },
                },
              ]}
              getTdProps={(state, rowInfo) => {
                const rowIndex = rowInfo ? rowInfo.index : undefined
                return {
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      this.handleSelect(rowInfo.original, rowInfo.index)
                    }
                    if (handleOriginal) {
                      handleOriginal()
                    }
                  },
                  style: {
                    background:
                      rowIndex === selectedRowIdx
                        ? theme.palette.secondary.light
                        : 'white',
                    color:
                      rowIndex === selectedRowIdx
                        ? theme.palette.secondary.contrastText
                        : theme.palette.primary.main,
                  },
                }
              }}
            />
          </CardContent>
        </Card>
        {detailDialogOpen &&
        <ZX303TrackerDetailDialogContainer
          open={detailDialogOpen}
          closeDialog={() => this.setState({detailDialogOpen: false})}
          zx303Tracker={zx303DeviceEntity}
          initialActiveState={initialDetailDialogActiveState}
        />}
        {batteryLifeDialogOpen &&
        <ZX303TrackerBatteryLifeDialogContainer
          open={batteryLifeDialogOpen}
          closeDialog={() => this.setState({batteryLifeDialogOpen: false})}
          zx303Tracker={zx303DeviceEntity}
        />}
      </div>
    )
  }
}

ZX303 = withStyles(styles, {withTheme: true})(ZX303)

ZX303.propTypes = {
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Show Global App Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global App Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(HumanUserLoginClaims),
  /**
   * Party from redux state
   */
  party: PropTypes.object.isRequired,
}
ZX303.defaultProps = {}

export default ZX303