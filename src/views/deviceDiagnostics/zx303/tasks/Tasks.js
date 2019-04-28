import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  withStyles,
} from '@material-ui/core'
import {TextCriterionType} from 'brain/search/criterion/types'
import BEPTable from 'components/table/bepTable/BEPTable'
import {ZX303 as ZX303Device} from 'brain/tracker/zx303/index'
import Query from 'brain/search/Query'
import ZX303DeviceRecordHandler from 'brain/tracker/zx303/RecordHandler'
import PartyHolder from 'brain/party/holder/Holder'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import Task, {
  TaskRecordHandler,
  TaskValidator,
  TaskAdministrator,
} from 'brain/tracker/zx303/task'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
  cardHeaderRoot: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  deviceTableRoot: {},
  tableCard: {
    overflow: 'auto',
  },
})

const pageStates = {
  nop: 0,
  deviceSelected: 1,
}

const pageEvents = {
  init: pageStates.nop,
  selectDevice: pageStates.deviceSelected,
}

const taskStates = {
  nop: 0,
  viewingTask: 1,
  creatingNewTask: 2,
}

const taskEvents = {
  init: taskStates.nop,
  selectTask: taskStates.viewingTask,
  startCreateNewTask: taskStates.creatingNewTask,
}

class Tasks extends Component {
  state = {
    activePageState: pageEvents.init,
    activeTaskState: taskEvents.init,
    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    deviceRecords: [],
    deviceTotalNoRecords: 0,
    selectedZX303Device: new ZX303Device(),
  }

  deviceCollectCriteria = []
  deviceCollectQuery = new Query()
  deviceCollectTimeout = () => {
  }
  partyHolder = new PartyHolder()

  componentDidMount() {
    this.deviceCollect()
  }

  deviceCollect = async () => {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props
    this.setState({
      recordCollectionInProgress: true,
    })

    let collectResponse
    try {
      collectResponse = await ZX303DeviceRecordHandler.Collect(
          this.deviceCollectCriteria,
          this.deviceCollectQuery,
      )
      this.setState({
        deviceRecords: collectResponse.records,
        deviceTotalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching ZX303 devices', e)
      NotificationFailure('Error Fetching ZX303 devices', e)
      this.setState({recordCollectionInProgress: false})
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
      this.setState({recordCollectionInProgress: false})
      return
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCriteriaQueryChange = (criteria, query) => {
    this.deviceCollectCriteria = criteria
    this.deviceCollectQuery = query
    this.deviceCollectTimeout = setTimeout(this.deviceCollect, 300)
    this.setState({
      activePageState: pageEvents.init,
      selectedRowIdx: -1,
      selectedZX303Device: new ZX303Device(),
    })
  }

  handleSelect = (rowObj, rowIdx) => {
    this.setState({
      selectedRowIdx: rowIdx,
      activePageState: pageEvents.selectDevice,
      zx303DeviceEntity: new ZX303Device(rowObj),
    })
  }

  render() {
    const {
      classes,
      theme,
    } = this.props
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      deviceRecords,
      deviceTotalNoRecords,
    } = this.state

    return (
        <div
            className={classes.root}
        >
          <div className={classes.deviceTableRoot}>
            <Card
                id={'zx303ConfigurationDetailCard'}
                className={classes.tableCard}
            >
              <CardHeader
                  title={'Select Device To Manage Tasks'}
                  classes={{root: classes.cardHeaderRoot}}
              />
              <CardContent>
                <BEPTable
                    loading={recordCollectionInProgress}
                    totalNoRecords={deviceTotalNoRecords}
                    noDataText={'No Devices Found'}
                    data={deviceRecords}
                    onCriteriaQueryChange={this.handleCriteriaQueryChange}
                    columns={[
                      {
                        Header: 'IMEI',
                        accessor: 'imei',
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
                      },
                      {
                        Header: 'Owner Party Type',
                        accessor: 'ownerPartyType',
                        width: 136,
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
                        width: 160,
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
                      {
                        Header: 'Sim Number',
                        accessor: 'simNumber',
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
                          cursor: 'pointer',
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
          </div>
        </div>
    )
  }
}

Tasks = withStyles(styles, {withTheme: true})(Tasks)

Tasks.propTypes = {
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
Tasks.defaultProps = {}

export default Tasks