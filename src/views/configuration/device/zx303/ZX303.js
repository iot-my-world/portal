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
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
import {ZX303 as ZX303Device} from 'brain/tracker/device/zx303'
import {allPartyTypes} from 'brain/party/types'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
    justifyItems: 'center',
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
    device: new ZX303Device(),
    deviceCopy: new ZX303Device(),
  }

  reasonsInvalid = new ReasonsInvalid()
  collectCriteria = []
  collectQuery = new Query()

  handleCreateNew = () => {
    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      device: new ZX303Device(),
    })
  }

  handleCancelCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  handleStartEditExisting = () => {
    const {device} = this.state
    this.setState({
      deviceCopy: new ZX303Device(device),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting = () => {
    const {deviceCopy} = this.state
    this.setState({
      device: new ZX303Device(deviceCopy),
      activeState: events.cancelEditExisting,
    })
  }

  handleSaveNew = () => {

  }

  handleSaveChanges = () => {

  }

  handleFieldChange = e => {
    let {device} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    device[fieldName] = e.target.value
    this.reasonsInvalid.clearField(fieldName)
    this.setState({device})
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
        const {device} = this.state
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
                      value={device.ownerPartyType}
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
                <TextField
                    className={classes.formField}
                    id='ownerId'
                    label='Owned By'
                    value={device.ownerId.id}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
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
                      value={device.assignedPartyType}
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
                <TextField
                    className={classes.formField}
                    id='assignedId'
                    label='Assigned To'
                    value={device.assignedId.id}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
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
                    value={device.simCountryCode}
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
                    value={device.simNumber}
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
                    value={device.imei}
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

  handleCriteriaQueryChange = () => {

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
      maxViewDimensions,
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
          <div>
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
          <div>
            <Card style={{width: maxViewDimensions.width - 30}}>
              <CardContent>
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
                          }
                        }
                      },
                      {
                        Header: 'Owned By',
                        accessor: 'ownerId',
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
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
                        width: 150,
                        config: {
                          filter: {
                            type: TextCriterionType,
                          },
                        },
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
   * maxViewDimensions from redux state
   */
  maxViewDimensions: PropTypes.object.isRequired,
}
ZX303.defaultProps = {}

export default ZX303