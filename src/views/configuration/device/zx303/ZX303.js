import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader, Fab, FormControl, FormHelperText,
  Grid, InputLabel, MenuItem, Select, TextField, Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'
import Query from 'brain/search/Query'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import DeviceIcon from '@material-ui/icons/DevicesOther'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
import {ZX303 as ZX303Device} from 'brain/tracker/device/zx303'
import {
  allPartyTypes, ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import SystemRecordHandler from 'brain/party/system/RecordHandler'
import TextCriterion from 'brain/search/criterion/Text'
import IdIdentifier from 'brain/search/identifier/Id'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'
import ClientRecordHandler from 'brain/party/client/RecordHandler'
import {
  ZX303DeviceAdministrator, ZX303DeviceValidator, ZX303DeviceRecordHandler,
} from 'brain/tracker/device/zx303'
import {PartyHolder} from 'brain/party/holder'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
  detailCardWrapper: {
    justifySelf: 'center',
  },
  tableWrapper: {
    overflow: 'auto',
  },
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
  detailCard: {
    maxWidth: 400,
  },
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  icon: {
    fontSize: 100,
    color: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttonIcon: {
    fontSize: '20px',
  },
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  // init: states.nop,
  init: states.editingNew,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.viewingExisting,
  cancelEditExisting: states.viewingExisting,
}

class ZX303 extends Component {

  state = {
    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
    activeState: events.init,
    zx303DeviceEntity: new ZX303Device(),
    zx303DeviceEntityCopy: new ZX303Device(),
  }

  partyHolder = new PartyHolder()
  collectTimeout = () => {
  }
  reasonsInvalid = new ReasonsInvalid()
  collectCriteria = []
  collectQuery = new Query()

  componentDidMount() {
    this.collect()
  }

  collect = async () => {
    const {NotificationFailure} = this.props
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
    }

    try {
      await this.partyHolder.load(
          collectResponse.records,
          'ownerPartyType',
          'ownerId',
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
      activeState: events.startCreateNew,
      zx303DeviceEntity: new ZX303Device(),
    })
  }

  handleCancelCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  handleStartEditExisting = () => {
    const {zx303DeviceEntity} = this.state
    this.setState({
      zx303DeviceEntityCopy: new ZX303Device(zx303DeviceEntity),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting = () => {
    const {zx303DeviceEntityCopy} = this.state
    this.setState({
      zx303DeviceEntity: new ZX303Device(zx303DeviceEntityCopy),
      activeState: events.cancelEditExisting,
    })
  }

  handleSaveNew = async () => {
    const {zx303DeviceEntity} = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await ZX303DeviceValidator.Validate({
        zx303DeviceEntity,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Device', e)
      NotificationFailure('Error Validating Device')
      HideGlobalLoader()
      return
    }

    // perform creation
    try {
      await ZX303DeviceAdministrator.Create({zx303DeviceEntity})
    } catch (e) {
      console.error('Error Creating Device', e)
      NotificationFailure('Error Creating Device')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Created Device')
    HideGlobalLoader()
  }

  handleSaveChanges = () => {

  }

  loadPartyOptions = partyType => async (inputValue, callback) => {
    let collectResponse
    let callbackResults = []
    switch (partyType) {
      case SystemPartyType:
        collectResponse = await SystemRecordHandler.Collect(
            [
              new TextCriterion({
                field: 'name',
                text: inputValue,
              }),
            ],
        )
        callbackResults = collectResponse.records.map(system => ({
          label: system.name,
          value: new IdIdentifier(system.id),
          entity: system,
        }))
        break

      case CompanyPartyType:
        collectResponse = await CompanyRecordHandler.Collect(
            [
              new TextCriterion({
                field: 'name',
                text: inputValue,
              }),
            ],
        )
        callbackResults = collectResponse.records.map(company => ({
          label: company.name,
          value: new IdIdentifier(company.id),
          entity: company,
        }))
        break

      case ClientPartyType:
        collectResponse = await ClientRecordHandler.Collect(
            [
              new TextCriterion({
                field: 'name',
                text: inputValue,
              }),
            ],
        )
        callbackResults = collectResponse.records.map(client => ({
          label: client.name,
          value: new IdIdentifier(client.id),
          entity: client,
        }))
        break

      default:
        callbackResults = []
    }
    callbackResults = [{label: '-', value: ''}, ...callbackResults]
    callback(callbackResults)
  }

  handleFieldChange = e => {
    let {zx303DeviceEntity} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    zx303DeviceEntity[fieldName] = e.target.value

    switch (fieldName) {
      case 'ownerPartyType':
        zx303DeviceEntity.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        // update entity map
        break

      case 'assignedPartyType':
        zx303DeviceEntity.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        // update entity map
        break

      default:
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({zx303DeviceEntity})
  }

  renderDetails = () => {
    const {activeState} = this.state
    const {classes} = this.props

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === states.viewingExisting

    switch (activeState) {
      case states.nop:
        return (
            <Grid
                container
                direction={'column'}
                spacing={8}
                alignItems={'center'}
            >
              <Grid item>
                <DeviceIcon className={classes.icon}/>
              </Grid>
              <Grid item>
                <Fab
                    id={'zx303DeviceConfigurationNewButton'}
                    color={'primary'}
                    className={classes.button}
                    size={'small'}
                    onClick={this.handleCreateNew}
                >
                  <Tooltip title='Add New Device'>
                    <AddIcon className={classes.buttonIcon}/>
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {zx303DeviceEntity} = this.state
        return (
            <Grid container spacing={8}>
              <Grid item xs>
                <FormControl
                    className={classes.formField}
                    error={!!fieldValidations.ownerPartyType}
                    aria-describedby='ownerPartyType'
                >
                  <InputLabel htmlFor='ownerPartyType'>
                    Owner Party Type
                  </InputLabel>
                  <Select
                      id='ownerPartyType'
                      name='ownerPartyType'
                      value={zx303DeviceEntity.ownerPartyType}
                      onChange={this.handleFieldChange}
                      style={{width: 150}}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {allPartyTypes.map((partyType, idx) => {
                      return (
                          <MenuItem key={idx} value={partyType}>
                            {partyType}
                          </MenuItem>
                      )
                    })}
                  </Select>
                  {!!fieldValidations.ownerPartyType && (
                      <FormHelperText id='ownerPartyType'>
                        {
                          fieldValidations.ownerPartyType ?
                              fieldValidations.ownerPartyType.help :
                              undefined
                        }
                      </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs>
                <AsyncSelect
                    id='ownerId'
                    label={'Owner'}
                    value={{
                      value: zx303DeviceEntity.ownerId,
                      label: zx303DeviceEntity.ownerId.id,
                    }}
                    onChange={this.handleFieldChange}
                    loadOptions={this.loadPartyOptions(
                        zx303DeviceEntity.ownerPartyType)}
                    menuPosition={'fixed'}
                    readOnly={stateIsViewing}
                    helperText={
                      fieldValidations.ownerId
                          ? fieldValidations.ownerId.help
                          : undefined
                    }
                    error={!!fieldValidations.ownerId}
                />
              </Grid>
              <Grid item xs>
                <FormControl
                    className={classes.formField}
                    error={!!fieldValidations.assignedPartyType}
                    aria-describedby='assignedPartyType'
                >
                  <InputLabel htmlFor='assignedPartyType'>
                    Assigned Party Type
                  </InputLabel>
                  <Select
                      id='assignedPartyType'
                      name='assignedPartyType'
                      value={zx303DeviceEntity.assignedPartyType}
                      onChange={this.handleFieldChange}
                      style={{width: 150}}
                  >
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    {allPartyTypes.map((partyType, idx) => {
                      return (
                          <MenuItem key={idx} value={partyType}>
                            {partyType}
                          </MenuItem>
                      )
                    })}
                  </Select>
                  {!!fieldValidations.assignedPartyType && (
                      <FormHelperText id='assignedPartyType'>
                        {
                          fieldValidations.assignedPartyType ?
                              fieldValidations.assignedPartyType.help :
                              undefined
                        }
                      </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs>
                <AsyncSelect
                    id='assignedId'
                    label='Assigned To'
                    value={{
                      value: zx303DeviceEntity.assignedId,
                      label: zx303DeviceEntity.assignedId.id,
                    }}
                    onChange={this.handleFieldChange}
                    loadOptions={this.loadPartyOptions(
                        zx303DeviceEntity.assignedPartyType)}
                    menuPosition={'fixed'}
                    readOnly={stateIsViewing}
                    helperText={
                      fieldValidations.assignedId
                          ? fieldValidations.assignedId.help
                          : undefined
                    }
                    error={!!fieldValidations.assignedId}
                />
              </Grid>
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='simCountryCode'
                    label='Sim Country Code'
                    value={zx303DeviceEntity.simCountryCode}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.simCountryCode
                          ? fieldValidations.simCountryCode.help
                          : undefined
                    }
                    error={!!fieldValidations.simCountryCode}
                />
              </Grid>
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='simNumber'
                    label='Sim Number'
                    value={zx303DeviceEntity.simNumber}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.simNumber
                          ? fieldValidations.simNumber.help
                          : undefined
                    }
                    error={!!fieldValidations.simNumber}
                />
              </Grid>
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='imei'
                    label='IMEI'
                    value={zx303DeviceEntity.imei}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.imei
                          ? fieldValidations.imei.help
                          : undefined
                    }
                    error={!!fieldValidations.imei}
                />
              </Grid>
            </Grid>
        )
      default:
        return null
    }

  }

  renderControlIcons = () => {
    const {activeState} = this.state
    const {classes} = this.props

    switch (activeState) {
      case states.viewingExisting:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleStartEditExisting}
              >
                <Tooltip title='Edit'>
                  <EditIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  id={'companyConfigurationNewDeviceButton'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCreateNew}
              >
                <Tooltip title='Add New Device'>
                  <AddIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.editingNew:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleSaveNew}
              >
                <Tooltip title='Save New Device'>
                  <SaveIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCancelCreateNew}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.editingExisting:
        return (
            <React.Fragment>
              <Fab
                  color={'primary'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleSaveChanges}
              >
                <Tooltip title='Save Changes'>
                  <SaveIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCancelEditExisting}
              >
                <Tooltip title='Cancel'>
                  <CancelIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>
            </React.Fragment>
        )

      case states.nop:
      default:
    }
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
      activeState: events.selectExisting,
    })
  }

  render() {
    const {
      recordCollectionInProgress,
      selectedRowIdx,
      records,
      totalNoRecords,
      activeState,
    } = this.state
    const {
      theme,
      classes,
    } = this.props

    let cardTitle = (
        <Typography variant={'h6'}>
          Select A Device To View Or Edit
        </Typography>
    )
    switch (activeState) {
      case states.editingNew:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                New Device
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      case states.editingExisting:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                Editing
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      case states.viewingExisting:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                Details
              </Typography>
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            </div>
        )
        break
      default:
    }

    return (
        <div
            id={'companyConfigurationRoot'}
            className={classes.root}
        >
          <div className={classes.detailCardWrapper}>
            <Grid container>
              <Grid item>
                <Card
                    id={'companyConfigurationDetailCard'}
                    className={classes.detailCard}
                >
                  <CardHeader title={cardTitle}/>
                  <CardContent>
                    {this.renderDetails()}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          <div className={classes.tableWrapper}>
            <BEPTable
                loading={recordCollectionInProgress}
                totalNoRecords={totalNoRecords}
                noDataText={'No Devices Found'}
                data={records}
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
                  // {
                  //   Header: 'Owned By',
                  //   accessor: 'ownerId',
                  //   width: 150,
                  //   config: {
                  //     filter: {
                  //       type: TextCriterionType,
                  //     },
                  //   },
                  // },
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
                  // {
                  //   Header: 'Assigned To',
                  //   accessor: 'assignedId',
                  //   width: 150,
                  //   config: {
                  //     filter: {
                  //       type: TextCriterionType,
                  //     },
                  //   },
                  // },
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
          </div>
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
}
ZX303.defaultProps = {}

export default ZX303