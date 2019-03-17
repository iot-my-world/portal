import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CardHeader,
  Fab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem, FormHelperText,
} from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/People'
import {BEPTable} from 'components/table/index'
import {
  Client as ClientEntity,
  ClientRecordHandler,
  ClientValidator,
  ClientAdministrator,
} from 'brain/party/client/index'
import {CompanyRecordHandler} from 'brain/party/company'
import {SystemRecordHandler} from 'brain/party/system'
import {ReasonsInvalid} from 'brain/validate/index'
import {Text} from 'brain/search/criterion/types'
import {TextCriterion} from 'brain/search/criterion'
import {Query} from 'brain/search/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import {LoginClaims} from 'brain/security/claims'
import {
  allPartyTypes,
  Client as ClientPartyType, Company,
  System,
} from 'brain/party/types'
import IdIdentifier from 'brain/search/identifier/Id'
import {
  MdAdd as AddIcon, MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdEmail as SendEmailIcon, MdSave as SaveIcon,
} from 'react-icons/md'
import {AsyncSelect} from 'components/form'
import ListTextCriterion from 'brain/search/criterion/list/Text'
import {retrieveFromList} from 'brain/search/identifier/utilities'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  progress: {
    margin: 2,
  },
  detailCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  clientIcon: {
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
  init: states.nop,

  selectExisting: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.viewingExisting,
  cancelEditExisting: states.viewingExisting,
}

class Client extends Component {
  constructor(props) {
    super(props)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.renderClientDetails = this.renderClientDetails.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInviteAdmin = this.handleInviteAdmin.bind(this)
    this.handleCreateNew = this.handleCreateNew.bind(this)
    this.handleCancelCreateNew = this.handleCancelCreateNew.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleStartEditExisting = this.handleStartEditExisting.bind(this)
    this.handleCancelEditExisting = this.handleCancelEditExisting.bind(this)
    this.loadParentPartyOptions = this.loadParentPartyOptions.bind(this)
    this.getPartyName = this.getPartyName.bind(this)
    this.buildColumns = this.buildColumns.bind(this)
    this.buildColumns()
    this.collectTimeout = () => {
    }
  }

  state = {
    recordCollectionInProgress: false,
    activeState: events.init,
    client: new ClientEntity(),
    clientCopy: new ClientEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
    defaultParent: {label: '-', value: ''},
  }

  reasonsInvalid = new ReasonsInvalid()

  clientRegistration = {}

  collectCriteria = []

  collectQuery = new Query()

  entityMap = {
    Company: [],
    System: [],
  }

  columns = []

  componentDidMount() {
    this.collect()
  }

  handleCreateNew() {
    const {claims, party} = this.props
    let newClientEntity = new ClientEntity()
    newClientEntity.parentId = claims.partyId
    newClientEntity.parentPartyType = claims.partyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      client: newClientEntity,
      defaultParent: {label: party.name, value: party.id},
    })
  }

  handleFieldChange(event) {
    let {client} = this.state
    const field = event.target.id ? event.target.id : event.target.name
    client[field] = event.target.value
    this.reasonsInvalid.clearField(field)
    this.setState({client})
  }

  async loadParentPartyOptions(inputValue, callback) {
    const {client} = this.state
    let collectResponse
    let callbackResults = []
    switch (client.parentPartyType) {
      case System:
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
        }))
        break

      case Company:
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
        }))
        break

      default:
        callbackResults = []
    }
    callbackResults = [{label: '-', value: ''}, ...callbackResults]
    callback(callbackResults)
  }

  async handleSaveNew() {
    const {client} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await ClientValidator.Validate({
        client,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Client', e)
      NotificationFailure('Error Validating Client')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform create
    try {
      await ClientAdministrator.Create({client})
      NotificationSuccess('Successfully Created Client')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Creating Client', e)
      NotificationFailure('Error Creating Client')
      HideGlobalLoader()
    }
  }

  handleCancelCreateNew() {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  async handleSaveChanges() {
    const {client} = this.state
    let {records} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await ClientValidator.Validate({
        client,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Client', e)
      NotificationFailure('Error Validating Client')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform update
    try {
      let response = await ClientAdministrator.UpdateAllowedFields({client})
      const clientIdx = records.findIndex(c => c.id === response.client.id)
      if (clientIdx < 0) {
        console.error('unable to find updated client in records')
      } else {
        records[clientIdx] = response.client
      }
      NotificationSuccess('Successfully Updated Client')
      this.setState({
        records,
        client: response.client,
        activeState: events.finishEditExisting,
      })
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Updating Client', e)
      NotificationFailure('Error Updating Client')
      HideGlobalLoader()
    }
  }

  handleStartEditExisting() {
    const {client} = this.state
    this.setState({
      clientCopy: new ClientEntity(client),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting() {
    const {clientCopy} = this.state
    this.setState({
      client: new ClientEntity(clientCopy),
      activeState: events.cancelEditExisting,
    })
  }

  async collect() {
    const {NotificationFailure} = this.props

    this.setState({recordCollectionInProgress: true})
    let collectResponse
    try {
      collectResponse = await ClientRecordHandler.Collect(
          this.collectCriteria, this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error(`error collecting records: ${e}`)
      NotificationFailure('Failed To Fetch Clients')
      return
    }

    try {
      // find the admin user registration status of these clients
      this.clientRegistration =
          (await PartyRegistrar.AreAdminsRegistered({
            partyDetails: collectResponse.records.map(client => {
              return {
                partyId: (new IdIdentifier(client.id)).value,
                partyType: ClientPartyType,
              }
            }),
          })).result
    } catch (e) {
      console.error('error determining client registration', e)
      NotificationFailure('Failed To Determine Client Registration')
      return
    }

    try {
      // compile list criteria for retrieval of party entities associated
      // with these clients
      let systemEntityIds = []
      let companyEntityIds = []
      collectResponse.records.forEach(record => {
        switch (record.parentPartyType) {
          case System:
            if (!systemEntityIds.includes(record.parentId.id)) {
              systemEntityIds.push(record.parentId.id)
            }
            break
          case Company:
            if (!companyEntityIds.includes(record.parentId.id)) {
              companyEntityIds.push(record.parentId.id)
            }
            break
          default:
        }
      })

      // fetch system entities
      try {
        if (systemEntityIds.length > 0) {
          const blankQuery = new Query()
          blankQuery.limit = 0
          this.entityMap.System = (await SystemRecordHandler.Collect(
              [
                new ListTextCriterion({
                  field: 'id',
                  list: systemEntityIds,
                }),
              ],
              blankQuery,
          )).records
        }

        if (companyEntityIds.length > 0) {
          const blankQuery = new Query()
          blankQuery.limit = 0
          this.entityMap.Company = (await CompanyRecordHandler.Collect(
              [
                new ListTextCriterion({
                  field: 'id',
                  list: companyEntityIds,
                }),
              ],
              blankQuery,
          )).records
        }
      } catch (e) {
        this.entityMap.System = []
        console.error('error collecting system records', e)
        NotificationFailure('Failed To Fetch System Records')
        this.setState({recordCollectionInProgress: false})
        return
      }
    } catch (e) {
      console.error('Failed Getting Parent Party Entities', e)
      NotificationFailure('Failed Getting Parent Party Entities')
      return
    }
    
    this.setState({recordCollectionInProgress: false})
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      activeState: events.init,
      client: new ClientEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.setState({
      selectedRowIdx: rowIdx,
      client: new ClientEntity(rowRecordObj),
      activeState: events.selectExisting,
      defaultParent: {
        label: this.getPartyName(
            rowRecordObj.parentPartyType,
            rowRecordObj.parentId,
        ),
        value: rowRecordObj.parentId,
      },
    })
  }

  async handleInviteAdmin() {
    const {client} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteClientAdminUser({
        clientIdentifier: client.identifier,
      })
      NotificationSuccess('Successfully Invited Client Admin User')
    } catch (e) {
      console.error('Failed to Invite Client Admin User', e)
      NotificationFailure('Failed to Invite Client Admin User')
    }
    HideGlobalLoader()
  }

  getPartyName(partyType, partyId) {
    const list = this.entityMap[partyType]
    const entity = retrieveFromList(partyId, list ? list : [])
    return entity ? entity.name : ''
  }

  buildColumns() {
    const {claims} = this.props
    this.columns = [
      {
        Header: 'Name',
        accessor: 'name',
        config: {
          filter: {
            type: Text,
          },
        },
      },
      {
        Header: 'Admin Email',
        accessor: 'adminEmailAddress',
        config: {
          filter: {
            type: Text,
          },
        },
      },
      {
        Header: 'Admin Registered',
        accessor: '',
        filterable: false,
        sortable: false,
        Cell: rowCellInfo => {
          if (this.clientRegistration[rowCellInfo.original.id]) {
            return 'Yes'
          } else {
            return 'No'
          }
        },
      },
    ]

    if (claims.partyType === System) {
      this.columns = [
        {
          Header: 'Parent Party',
          accessor: 'parentId',
          width: 150,
          Cell: rowCellInfo => {
            try {
              return this.getPartyName(
                  rowCellInfo.original.parentPartyType,
                  rowCellInfo.value,
              )
            } catch (e) {
              console.error('error getting parent party info', e)
              return '-'
            }
          },
          config: {
            filter: {
              type: Text,
            },
          },
        },
        ...this.columns,
      ]
    }
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
          Select A Client To View Or Edit
        </Typography>
    )
    switch (activeState) {
      case states.editingNew:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                New Client
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
        <Grid container direction='column' spacing={8} alignItems='center'>
          <Grid item xl={12}>
            <Grid container>
              <Grid item>
                <Card className={classes.detailCard}>
                  <CardHeader title={cardTitle}/>
                  <CardContent>
                    {this.renderClientDetails()}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={12}>
            <Card style={{maxWidth: maxViewDimensions.width - 10}}>
              <CardContent>
                <BEPTable
                    loading={recordCollectionInProgress}
                    totalNoRecords={totalNoRecords}
                    noDataText={'No Clients Found'}
                    data={records}
                    onCriteriaQueryChange={this.handleCriteriaQueryChange}

                    columns={this.columns}

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
                          background: rowIndex === selectedRowIdx ?
                              theme.palette.secondary.light :
                              'white',
                          color: rowIndex === selectedRowIdx ?
                              theme.palette.secondary.contrastText :
                              theme.palette.primary.main,
                        },
                      }
                    }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }

  renderClientDetails() {
    const {activeState} = this.state
    const {classes, claims} = this.props
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
                <PeopleIcon className={classes.clientIcon}/>
              </Grid>
              <Grid item>
                <Fab
                    color={'primary'}
                    className={classes.button}
                    size={'small'}
                    onClick={this.handleCreateNew}
                >
                  <Tooltip title='Add New Client'>
                    <AddIcon className={classes.buttonIcon}/>
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {client, defaultParent} = this.state
        return <Grid
            container
            direction='column'
            spacing={8}
            alignItems={'center'}
        >
          {(claims.partyType === System) &&
          <React.Fragment>
            <Grid item>
              <FormControl
                  className={classes.formField}
                  error={!!fieldValidations.parentPartyType}
                  aria-describedby='parentPartyType'
              >
                <InputLabel htmlFor='parentPartyType'>
                  Parent Party Type
                </InputLabel>
                <Select
                    id='parentPartyType'
                    name='parentPartyType'
                    value={client.parentPartyType}
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
                {!!fieldValidations.ownerPartyType && (
                    <FormHelperText id='parentPartyType'>
                      {fieldValidations.parentPartyType
                          ? fieldValidations.parentPartyType.help
                          : undefined}
                    </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item>
              <AsyncSelect
                  cacheOptions
                  name={'parentId'}
                  disabled={stateIsViewing}
                  ExtraTextFieldProps={{
                    label: 'Parent',
                    InputLabelProps: {
                      shrink: true,
                    },
                    InputProps: {
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    },
                    helperText:
                        fieldValidations.parentId
                            ? fieldValidations.parentId.help
                            : undefined,
                    error: !!fieldValidations.parentId,
                  }}
                  defaultValue={defaultParent}
                  loadParentPartyOptions={this.loadParentPartyOptions}
                  onChange={this.handleFieldChange}
              />
            </Grid>
          </React.Fragment>
          }
          <Grid item>
            <TextField
                className={classes.formField}
                id='name'
                label='Name'
                value={client.name}
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
          <Grid item>
            <TextField
                className={classes.formField}
                id='adminEmailAddress'
                label='Admin Email'
                value={client.adminEmailAddress}
                onChange={this.handleFieldChange}
                InputProps={{
                  disableUnderline: stateIsViewing,
                  readOnly: stateIsViewing,
                }}
                helperText={
                  fieldValidations.adminEmailAddress
                      ? fieldValidations.adminEmailAddress.help
                      : undefined
                }
                error={!!fieldValidations.adminEmailAddress}
            />
          </Grid>
        </Grid>

      default:
    }

  }

  renderControlIcons() {
    const {activeState, client} = this.state
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
              {(!this.clientRegistration[client.id]) &&
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleInviteAdmin}
              >
                <Tooltip title='Invite Admin'>
                  <SendEmailIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>}
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCreateNew}
              >
                <Tooltip title='Add New Client'>
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
                <Tooltip title='Save New Client'>
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
}

Client = withStyles(styles, {withTheme: true})(Client)

Client.propTypes = {
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
  claims: PropTypes.instanceOf(LoginClaims),
  /**
   * Party from redux state
   */
  party: PropTypes.object.isRequired,
  /**
   * maxViewDimensions from redux state
   */
  maxViewDimensions: PropTypes.object.isRequired,
}

Client.defaultProps = {}

export default Client