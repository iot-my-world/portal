import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  withStyles,
  Button,
  Typography, Grid, Collapse, Fab, Tooltip,
} from '@material-ui/core'
import {TextCriterionType} from 'brain/search/criterion/types'
import {ExactTextCriterion} from 'brain/search/criterion/exact'
import BEPTable from 'components/table/bepTable/BEPTable'
import {ZX303 as ZX303Device} from 'brain/tracker/zx303/index'
import Query from 'brain/search/Query'
import ZX303DeviceRecordHandler from 'brain/tracker/zx303/RecordHandler'
import PartyHolder from 'brain/party/holder/Holder'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import Task, {
  TaskRecordHandler,
  TaskGenerator,
  TaskAdministrator,
  TaskValidator,
} from 'brain/tracker/zx303/task'
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdRefresh as ResetIcon,
} from 'react-icons/md'
import {ResetDeviceZX303TaskType} from 'brain/tracker/zx303/task/types'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
  cardHeaderRoot: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  cardContentRoot: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  deviceTableRoot: {},
  tableCard: {
    overflow: 'auto',
  },
  taskTableRoot: {},
  taskTableCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonIcon: {
    fontSize: '20px',
  },
  taskButtonIcon: {
    marginLeft: theme.spacing(1),
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
  viewingTasks: 1,
  creatingNewTask: 2,
}

const taskEvents = {
  init: taskStates.nop,
  selectTask: taskStates.viewingTasks,
  startCreateNewTask: taskStates.creatingNewTask,
  cancelCreateNewTask: taskStates.viewingTasks,
}

class Tasks extends Component {
  state = {
    activePageState: pageEvents.init,

    // devices
    deviceRecordCollectionInProgress: false,
    deviceSelectedRowIdx: -1,
    deviceRecords: [],
    deviceTotalNoRecords: 0,
    selectedZX303Device: new ZX303Device(),

    // tasks
    activeTaskState: taskEvents.init,
    taskRecordCollectionInProgress: false,
    taskSelectedRowIdx: -1,
    taskRecords: [],
    taskTotalNoRecords: 0,
    selectedTask: new Task(),
  }

  deviceCollectCriteria = []
  deviceCollectQuery = new Query()
  deviceCollectTimeout = () => {
  }
  partyHolder = new PartyHolder()

  taskCollectCriteria = []
  taskCollectQuery = new Query()
  taskCollectTimeout = () => {
  }

  componentDidMount() {
    this.deviceCollect()
  }

  taskCollect = async () => {
    const {
      NotificationFailure,
    } = this.props

    this.setState({
      taskRecordCollectionInProgress: true,
    })

    let collectResponse
    try {
      collectResponse = await TaskRecordHandler.Collect(
          this.taskCollectCriteria,
          this.taskCollectQuery,
      )
      this.setState({
        taskRecords: collectResponse.records,
        taskTotalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching Device Tasks', e)
      NotificationFailure('Error Fetching Device Tasks', e)
    }
    this.setState({taskRecordCollectionInProgress: false})
  }

  deviceCollect = async () => {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props
    this.setState({
      deviceRecordCollectionInProgress: true,
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
      this.setState({deviceRecordCollectionInProgress: false})
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
      this.setState({deviceRecordCollectionInProgress: false})
      return
    }
    this.setState({deviceRecordCollectionInProgress: false})
  }

  handleDeviceCriteriaQueryChange = (criteria, query) => {
    this.deviceCollectCriteria = criteria
    this.deviceCollectQuery = query
    this.deviceCollectTimeout = setTimeout(this.deviceCollect, 300)
    this.setState({
      activePageState: pageEvents.init,
      deviceSelectedRowIdx: -1,
      selectedZX303Device: new ZX303Device(),
    })
  }

  handleDeviceSelect = (rowObj, rowIdx) => {
    this.taskCollectCriteria = [
      new ExactTextCriterion({
        field: 'deviceId.id',
        text: rowObj.id,
      }),
    ]
    this.setState({
      deviceSelectedRowIdx: rowIdx,
      activePageState: pageEvents.selectDevice,
      selectedZX303Device: new ZX303Device(rowObj),

      activeTaskState: taskEvents.selectTask,
      taskSelectedRowIdx: -1,
      selectedTask: new Task(),
    })
    this.taskCollect()
  }

  handleTaskCriteriaQueryChange = (criteria, query) => {
    this.taskCollectCriteria = criteria
    this.taskCollectQuery = query
    this.taskCollectTimeout = setTimeout(this.taskCollect, 300)
    this.setState({
      activeTaskState: taskEvents.init,
      taskSelectedRowIdx: -1,
      selectedTask: new Task(),
    })
  }

  handleTaskSelect = (rowObj, rowIdx) => {
    this.setState({
      taskSelectedRowIdx: rowIdx,
      activeTaskState: taskEvents.selectTask,
      selectedTask: new Task(rowObj),
    })
  }

  startCreateNewTask = () => {
    this.setState({activeTaskState: taskEvents.startCreateNewTask})
  }

  cancelCreateNewTask = () => {
    this.setState({activeTaskState: taskEvents.cancelCreateNewTask})
  }

  handleCreateNewTask = async zx303Task => {
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props
    ShowGlobalLoader()
    try {
      if ((await TaskValidator.Validate({
        zx303Task,
        action: 'Create',
      })).reasonsInvalid.count > 0) {
        NotificationFailure('New Task Not Valid')
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('error validating new task', e)
    }

    try {
      await TaskAdministrator.Sumbit({zx303Task})
      NotificationSuccess('New Task Submitted')
    } catch (e) {
      NotificationFailure('Error Submitting Task')
      console.error('error submitting new task', e)
    }
    HideGlobalLoader()
  }

  renderTaskControls = () => {
    const {activeTaskState} = this.state
    const {classes} = this.props
    switch (activeTaskState) {
      case taskStates.viewingTasks:
        return (
            <React.Fragment>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.startCreateNewTask}
              >
                <Tooltip title='New Task'>
                  <AddIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case taskStates.creatingNewTask:
        return (
            <React.Fragment>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.cancelCreateNewTask}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )
      default:
        return null
    }
  }

  renderTaskTable = () => {
    const {
      taskRecordCollectionInProgress,
      taskTotalNoRecords,
      taskRecords,
      taskSelectedRowIdx,
    } = this.state
    const {theme} = this.props
    return (
        <BEPTable
            loading={taskRecordCollectionInProgress}
            totalNoRecords={taskTotalNoRecords}
            noDataText={'No Tasks Found'}
            data={taskRecords}
            onCriteriaQueryChange={this.handleTaskCriteriaQueryChange}
            columns={[
              {
                Header: 'Type',
                accessor: 'type',
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
                    this.handleTaskSelect(rowInfo.original,
                        rowInfo.index)
                  }
                  if (handleOriginal) {
                    handleOriginal()
                  }
                },
                style: {
                  cursor: 'pointer',
                  background:
                      rowIndex === taskSelectedRowIdx
                          ? theme.palette.secondary.light
                          : 'white',
                  color:
                      rowIndex === taskSelectedRowIdx
                          ? theme.palette.secondary.contrastText
                          : theme.palette.primary.main,
                },
              }
            }}
        />
    )
  }

  renderNewTasks = () => {
    const {selectedZX303Device} = this.state
    const {classes} = this.props
    return (
        <Grid container>
          <Grid item>
            <Button
                variant="contained"
                color="default"
                className={classes.button}
                onClick={() => this.handleCreateNewTask(TaskGenerator(
                    ResetDeviceZX303TaskType,
                    selectedZX303Device,
                ))}
            >
              Reset
              <ResetIcon className={classes.taskButtonIcon}/>
            </Button>
          </Grid>
        </Grid>
    )
  }

  render() {
    const {
      classes,
      theme,
    } = this.props
    const {
      deviceRecordCollectionInProgress,
      deviceSelectedRowIdx,
      deviceRecords,
      deviceTotalNoRecords,
      activeTaskState,
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
                  title={
                    <Typography variant={'h6'}>
                      Select Device To Manage Tasks
                    </Typography>
                  }
                  classes={{root: classes.cardHeaderRoot}}
              />
              <CardContent
                  classes={{root: classes.cardContentRoot}}
              >
                <BEPTable
                    loading={deviceRecordCollectionInProgress}
                    totalNoRecords={deviceTotalNoRecords}
                    noDataText={'No Devices Found'}
                    data={deviceRecords}
                    onCriteriaQueryChange={this.handleDeviceCriteriaQueryChange}
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
                            this.handleDeviceSelect(rowInfo.original,
                                rowInfo.index)
                          }
                          if (handleOriginal) {
                            handleOriginal()
                          }
                        },
                        style: {
                          cursor: 'pointer',
                          background:
                              rowIndex === deviceSelectedRowIdx
                                  ? theme.palette.secondary.light
                                  : 'white',
                          color:
                              rowIndex === deviceSelectedRowIdx
                                  ? theme.palette.secondary.contrastText
                                  : theme.palette.primary.main,
                        },
                      }
                    }}
                />
              </CardContent>
            </Card>
          </div>
          <div className={classes.taskTableRoot}>
            <Collapse in={
              (activeTaskState === taskStates.viewingTasks) ||
              (activeTaskState === taskStates.creatingNewTask)
            }>
              <Card className={classes.taskTableCard}>
                <CardHeader
                    title={
                      <div className={classes.detailCardTitle}>
                        <Typography variant={'h6'}>
                          Select Task To View Details
                        </Typography>
                        <Grid container
                              direction='row'
                              justify='flex-end'
                        >
                          <Grid item>
                            {this.renderTaskControls()}
                          </Grid>
                        </Grid>
                      </div>
                    }
                    classes={{root: classes.cardHeaderRoot}}
                />
                <CardContent
                    classes={{root: classes.cardContentRoot}}
                >
                  <Collapse in={activeTaskState === taskStates.viewingTasks}>
                    {this.renderTaskTable()}
                  </Collapse>
                  <Collapse in={activeTaskState === taskStates.creatingNewTask}>
                    {this.renderNewTasks()}
                  </Collapse>
                </CardContent>
              </Card>
            </Collapse>
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