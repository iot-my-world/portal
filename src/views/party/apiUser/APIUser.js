import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader, Fab, FormControl, FormHelperText,
  Grid, InputLabel, MenuItem, Select, TextField, Tooltip,
  Typography, Dialog, DialogTitle, DialogContent,
  withStyles, DialogActions,
  Button,
} from '@material-ui/core'
import BEPTable from 'components/table/bepTable/BEPTable'
import {
  ExactTextCriterionType,
  TextCriterionType,
} from 'brain/search/criterion/types'
import Query from 'brain/search/Query'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import DeviceIcon from '@material-ui/icons/DevicesOther'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
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
  APIUser as APIUserEntity,
  APIUserAdministrator,
  APIUserValidator,
  APIUserRecordHandler,
} from 'brain/user/api'
import {PartyHolder} from 'brain/party/holder'
import {HumanUserLoginClaims} from 'brain/security/claims'
import MultiSelect from 'components/multiSelect/index'
import User from 'brain/user/human/User'

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
    margin: theme.spacing(1),
  },
  buttonIcon: {
    fontSize: '20px',
  },
  roleSelectHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  roleSelectSecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  roleSelectWrapper: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
  },
})

const states = {
  nop: 0,
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  init: states.nop,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.viewingExisting,
  cancelEditExisting: states.viewingExisting,
}

const partyTypeOptions = allPartyTypes.map(partyType =>
    ({value: partyType, display: partyType}),
)

class APIUser extends Component {

  state = {
    recordCollectionInProgress: false,
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
    activeState: events.init,
    apiUserEntity: new APIUserEntity(),
    apiUserEntityCopy: new APIUserEntity(),
    newAPIUserDialogOpen: false,
    newAPIUserCreateResponse: undefined,
    availableRoles: [],
  }

  constructor(props) {
    super(props)
    this.state.availableRoles = props.user.roles.map(role => ({
      name: role,
      value: role,
    }))
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      user,
    } = this.props
    const {
      user: prevUser,
    } = prevProps

    if (user.roles.length !== prevUser.roles.length) {
      this.setState({
        availableRoles: user.roles.map(role => ({
          name: role,
          value: role,
        })),
      })
    }
  }

  collect = async () => {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props
    this.setState({recordCollectionInProgress: true})
    // perform apiUser collection
    let collectResponse
    try {
      collectResponse = await APIUserRecordHandler.Collect(
          this.collectCriteria,
          this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error('Error Fetching API Users', e)
      NotificationFailure('Error Fetching API Users', e)
    }

    try {
      await this.partyHolder.load(
          collectResponse.records,
          'partyType',
          'partyId',
      )
      this.partyHolder.update(
          party,
          claims.partyType,
      )
    } catch (e) {
      console.error('Error Loading Owner Party', e)
      NotificationFailure('Error Loading Owner Party')
    }
    this.setState({recordCollectionInProgress: false})
  }

  handleCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      apiUserEntity: new APIUserEntity(),
    })
  }

  handleCancelCreateNew = () => {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {apiUserEntity} = this.state
    this.setState({
      apiUserEntityCopy: new APIUserEntity(apiUserEntity),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting = () => {
    const {apiUserEntityCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      apiUserEntity: new APIUserEntity(apiUserEntityCopy),
      activeState: events.cancelEditExisting,
    })
  }

  handleSaveNew = async () => {
    const {apiUserEntity} = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      this.reasonsInvalid.clearAll()
      const reasonsInvalid = (await APIUserValidator.Validate({
        apiUser: apiUserEntity,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating API User', e)
      NotificationFailure('Error Validating API User')
      HideGlobalLoader()
      return
    }

    // perform creation
    try {
      const newAPIUserCreateResponse = await APIUserAdministrator.Create({
        apiUser: apiUserEntity,
      })
      NotificationSuccess('Successfully Created API User')
      this.setState({
        activeState: events.createNewSuccess,
        newAPIUserDialogOpen: true,
        newAPIUserCreateResponse,
      })
      await this.collect()
    } catch (e) {
      console.error('Error Creating API User', e)
      NotificationFailure('Error Creating API User')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleSaveChanges = async () => {
    const {apiUserEntity} = this.state
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      this.reasonsInvalid.clearAll()
      const reasonsInvalid = (await APIUserValidator.Validate({
        apiUser: apiUserEntity,
        action: 'Update',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating APIUser', e)
      NotificationFailure('Error Validating APIUser')
      HideGlobalLoader()
      return
    }

    // perform update
    try {
      let {records} = this.state
      let response = await APIUserAdministrator.UpdateAllowedFields({
        apiUser: apiUserEntity,
      })
      const apiUserIdx = records.find(d => d.id === response.apiUser.id)
      if (apiUserIdx < 0) {
        console.error('unable to fund updated apiUser in records')
      } else {
        records[apiUserIdx] = response.apiUser
      }
      this.setState({
        records,
        apiUserEntity: response.apiUser,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating APIUser', e)
      NotificationFailure('Error Updating APIUser')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated APIUser')
    HideGlobalLoader()
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
    let {apiUserEntity} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    apiUserEntity[fieldName] = e.target.value

    switch (fieldName) {
      case 'partyType':
        apiUserEntity.partyId = new IdIdentifier()
        break

      case 'partyId':
        if (
            (!e.selectionInfo.value) ||
            (e.selectionInfo.value === '')
        ) {
          return
        }
        this.partyHolder.update(
            e.selectionInfo.entity,
            apiUserEntity.partyType,
        )
        break

      default:
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({apiUserEntity})
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
                    id={'apiUserDeviceConfigurationNewButton'}
                    color={'primary'}
                    className={classes.button}
                    size={'small'}
                    onClick={this.handleCreateNew}
                >
                  <Tooltip title='Add New APIUser'>
                    <AddIcon className={classes.buttonIcon}/>
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {apiUserEntity, availableRoles} = this.state
        return (
            <Grid container spacing={8}>
              <Grid item xs>
                <FormControl
                    className={classes.formField}
                    error={!!fieldValidations.partyType}
                    aria-describedby='partyType'
                >
                  <InputLabel htmlFor='partyType'>
                    Party Type
                  </InputLabel>
                  <Select
                      id='partyType'
                      name='partyType'
                      value={apiUserEntity.partyType}
                      onChange={this.handleFieldChange}
                      style={{width: 150}}
                      disableUnderline={stateIsViewing}
                      inputProps={{readOnly: stateIsViewing}}
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
                  {!!fieldValidations.partyType && (
                      <FormHelperText id='partyType'>
                        {
                          fieldValidations.partyType ?
                              fieldValidations.partyType.help :
                              undefined
                        }
                      </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs>
                <AsyncSelect
                    id='partyId'
                    label={'Party'}
                    value={{
                      value: apiUserEntity.partyId,
                      label: this.partyHolder.retrieveEntityProp(
                          'name',
                          apiUserEntity.partyId,
                      ),
                    }}
                    onChange={this.handleFieldChange}
                    loadOptions={this.loadPartyOptions(
                        apiUserEntity.partyType)}
                    menuPosition={'fixed'}
                    readOnly={stateIsViewing}
                    helperText={
                      fieldValidations.partyId
                          ? fieldValidations.partyId.help
                          : undefined
                    }
                    error={!!fieldValidations.partyId}
                />
              </Grid>
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='name'
                    label='Name'
                    value={apiUserEntity.name}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.name
                          ? fieldValidations.name.help
                          : undefined
                    }
                    error={!!fieldValidations.name}
                />
              </Grid>
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='description'
                    label='Description'
                    value={apiUserEntity.description}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.description
                          ? fieldValidations.description.help
                          : undefined
                    }
                    error={!!fieldValidations.description}
                />
              </Grid>
              {(activeState === states.viewingExisting) &&
              <Grid item xs>
                <TextField
                    className={classes.formField}
                    id='username'
                    label='Username'
                    value={apiUserEntity.username}
                    onChange={this.handleFieldChange}
                    InputProps={{
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    }}
                    helperText={
                      fieldValidations.username
                          ? fieldValidations.username.help
                          : undefined
                    }
                    error={!!fieldValidations.username}
                />
              </Grid>}
              <Grid item xl={12}>
                <div className={classes.roleSelectWrapper}>
                  <div>
                    <Typography className={classes.roleSelectHeading}>
                      Role Selection
                    </Typography>
                    <Typography className={classes.roleSelectSecondaryHeading}>
                      Select Roles To Assign to API User
                    </Typography>
                  </div>
                  <MultiSelect
                      displayAccessor='name'
                      uniqueIdAccessor='value'
                      selected={apiUserEntity.roles.map(role => ({
                        name: role,
                        value: role,
                      }))}
                      available={availableRoles}
                      onChange={(selectedRoles, availableRoles) => {
                        apiUserEntity.roles = selectedRoles.map(
                            role => role.name)
                        this.setState({
                          apiUserEntity,
                          availableRoles,
                        })
                      }}
                  />
                </div>
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
                <Tooltip title='Add New APIUser'>
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
                <Tooltip title='Save New APIUser'>
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
    this.reasonsInvalid.clearAll()
    this.setState({
      activeState: events.init,
      apiUserEntity: new APIUserEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect = (rowObj, rowIdx) => {
    this.reasonsInvalid.clearAll()
    this.setState({
      selectedRowIdx: rowIdx,
      apiUserEntity: new APIUserEntity(rowObj),
      activeState: events.selectExisting,
    })
  }

  renderNewAPIUserDialog = () => {
    const {newAPIUserDialogOpen, newAPIUserCreateResponse} = this.state
    if (!newAPIUserDialogOpen) {
      return null
    }
    return (
        <Dialog open={newAPIUserDialogOpen}>
          <DialogTitle>
            Copy API User Password
          </DialogTitle>
          <DialogContent>
            <Typography>
              After this dialog is closed it will not be possible to get this
              password again.
            </Typography>
            <Typography>
              <b>{'Username: '}</b>{newAPIUserCreateResponse.apiUser.username}
            </Typography>
            <Typography>
              <b>{'Password: '}</b>{newAPIUserCreateResponse.password}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
                onClick={() => this.setState({
                  newAPIUserDialogOpen: false,
                  newAPIUserCreateResponse: undefined,
                })}
                color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
    )
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
          Select An APIUser To View Or Edit
        </Typography>
    )
    switch (activeState) {
      case states.editingNew:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                New APIUser
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
          {this.renderNewAPIUserDialog()}
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
                noDataText={'No Users Found'}
                data={records}
                onCriteriaQueryChange={this.handleCriteriaQueryChange}
                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name',
                    width: 150,
                    config: {
                      filter: {
                        type: TextCriterionType,
                      },
                    },
                  },
                  {
                    Header: 'Description',
                    accessor: 'description',
                    width: 136,
                    config: {
                      filter: {
                        type: TextCriterionType,
                      },
                    },
                  },
                  {
                    Header: 'Username',
                    accessor: 'username',
                    width: 136,
                    config: {
                      filter: {
                        type: TextCriterionType,
                      },
                    },
                  },
                  {
                    Header: 'Party Type',
                    accessor: 'partyType',
                    width: 160,
                    config: {
                      filter: {
                        type: ExactTextCriterionType,
                        options: partyTypeOptions,
                        valueAccessor: 'value',
                        displayAccessor: 'display',
                      },
                    },
                  },
                  {
                    Header: 'Party',
                    accessor: 'partyId',
                    Cell: rowInfo => {
                      return this.partyHolder.retrieveEntityProp(
                          'name',
                          rowInfo.value,
                      )
                    },
                    width: 160,
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

APIUser = withStyles(styles, {withTheme: true})(APIUser)

APIUser.propTypes = {
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
  /**
   * User from redux state
   */
  user: PropTypes.instanceOf(User).isRequired,
}
APIUser.defaultProps = {}

export default APIUser