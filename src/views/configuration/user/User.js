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
import PersonIcon from '@material-ui/icons/Person'
import {BEPTable} from 'components/table/index'
import {
  User as UserEntity,
  UserRecordHandler,
  UserValidator,
  UserAdministrator,
} from 'brain/user/human'
import {CompanyRecordHandler} from 'brain/party/company'
import {SystemRecordHandler} from 'brain/party/system'
import {ClientRecordHandler} from 'brain/party/client'
import {ReasonsInvalid} from 'brain/validate/index'
import {TextCriterionType} from 'brain/search/criterion/types'
import {TextCriterion} from 'brain/search/criterion'
import {Query} from 'brain/search/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import {LoginClaims} from 'brain/security/claims'
import {
  allPartyTypes,
  CompanyPartyType,
  SystemPartyType,
  ClientPartyType,
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
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
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
  userIcon: {
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

class User extends Component {
  constructor(props) {
    super(props)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.renderUserDetails = this.renderUserDetails.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.collect = this.collect.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInviteUser = this.handleInviteUser.bind(this)
    this.handleCreateNew = this.handleCreateNew.bind(this)
    this.handleCancelCreateNew = this.handleCancelCreateNew.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleStartEditExisting = this.handleStartEditExisting.bind(this)
    this.handleCancelEditExisting = this.handleCancelEditExisting.bind(this)
    this.loadParentPartyOptions = this.loadParentPartyOptions.bind(this)
    this.loadPartyOptions = this.loadPartyOptions.bind(this)
    this.getPartyName = this.getPartyName.bind(this)
    this.buildColumns = this.buildColumns.bind(this)
    this.updateEntityMap = this.updateEntityMap.bind(this)
    this.buildColumns()
    this.collectTimeout = () => {
    }
  }

  state = {
    recordCollectionInProgress: false,
    activeState: events.init,
    user: new UserEntity(),
    userCopy: new UserEntity(),
    selectedRowIdx: -1,
    records: [],
    totalNoRecords: 0,
  }

  reasonsInvalid = new ReasonsInvalid()

  collectCriteria = []

  collectQuery = new Query({
    sortBy: [],
    order: [],
    limit: 15,
    offset: 0,
  })

  entityMap = {
    Company: [],
    System: [],
    Client: [],
  }

  columns = []

  handleCreateNew() {
    const {claims} = this.props
    let newUserEntity = new UserEntity()
    newUserEntity.partyId = claims.partyId
    newUserEntity.partyType = claims.partyType
    newUserEntity.parentId = claims.parentId
    newUserEntity.parentPartyType = claims.parentPartyType

    this.setState({
      selectedRowIdx: -1,
      activeState: events.startCreateNew,
      user: newUserEntity,
    })
  }

  componentDidMount() {
    this.collect()
  }

  handleFieldChange(event) {
    let {user} = this.state

    const field = event.target.id ? event.target.id : event.target.name
    user[field] = event.target.value

    // clear the party and parent party id field if the
    // party type for that field has changed
    switch (field) {
      case 'partyType':
        user.partyId = new IdIdentifier()
        break

      case 'partyId':
        this.updateEntityMap(
            event.selectionInfo.entity,
            user.partyType,
        )
        break

      case 'parentPartyType':
        user.parentId = new IdIdentifier()
        break

      case 'parentId':
        this.updateEntityMap(
            event.selectionInfo.entity,
            user.parentPartyType,
        )
        break

      default:
    }

    this.reasonsInvalid.clearField(field)
    this.setState({user})
  }

  async loadPartyOptions(inputValue, callback) {
    const {user} = this.state
    let collectResponse
    let callbackResults = []
    switch (user.partyType) {
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

  async loadParentPartyOptions(inputValue, callback) {
    const {user} = this.state
    let collectResponse
    let callbackResults = []
    switch (user.parentPartyType) {
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

  async handleSaveNew() {
    const {user} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await UserValidator.Validate({
        user,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating User', e)
      NotificationFailure('Error Validating User')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform create
    try {
      await UserAdministrator.Create({user})
      NotificationSuccess('Successfully Created User')
      this.setState({activeState: events.createNewSuccess})
      await this.collect()
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Creating User', e)
      NotificationFailure('Error Creating User')
      HideGlobalLoader()
    }
  }

  handleCancelCreateNew() {
    this.reasonsInvalid.clearAll()
    this.setState({activeState: events.cancelCreateNew})
  }

  async handleSaveChanges() {
    const {user} = this.state
    let {records} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()

    // perform validation
    try {
      const reasonsInvalid = (await UserValidator.Validate({
        user,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating User', e)
      NotificationFailure('Error Validating User')
      HideGlobalLoader()
      return
    }

    // if validation passes, perform update
    try {
      let response = await UserAdministrator.UpdateAllowedFields({user})
      const userIdx = records.findIndex(c => c.id === response.user.id)
      if (userIdx < 0) {
        console.error('unable to find updated user in records')
      } else {
        records[userIdx] = response.user
      }
      NotificationSuccess('Successfully Updated User')
      this.setState({
        records,
        user: response.user,
        activeState: events.finishEditExisting,
      })
      HideGlobalLoader()
    } catch (e) {
      console.error('Error Updating User', e)
      NotificationFailure('Error Updating User')
      HideGlobalLoader()
    }
  }

  handleStartEditExisting() {
    const {user} = this.state
    this.setState({
      userCopy: new UserEntity(user),
      activeState: events.startEditExisting,
    })
  }

  handleCancelEditExisting() {
    const {userCopy} = this.state
    this.setState({
      user: new UserEntity(userCopy),
      activeState: events.cancelEditExisting,
    })
  }

  async collect() {
    const {
      NotificationFailure,
      party,
      claims,
    } = this.props

    this.setState({recordCollectionInProgress: true})
    let collectResponse
    try {
      collectResponse = await UserRecordHandler.Collect(
          this.collectCriteria, this.collectQuery,
      )
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error(`error collecting records: ${e}`)
      NotificationFailure('Failed To Fetch Users')
      return
    }

    try {
      // compile list criteria for retrieval of party entities associated
      // with these users
      let systemEntityIds = []
      let companyEntityIds = []
      let clientEntityIds = []
      collectResponse.records.forEach(record => {
        switch (record.parentPartyType) {
          case SystemPartyType:
            if (!systemEntityIds.includes(record.parentId.id)) {
              systemEntityIds.push(record.parentId.id)
            }
            break
          case CompanyPartyType:
            if (!companyEntityIds.includes(record.parentId.id)) {
              companyEntityIds.push(record.parentId.id)
            }
            break
          case ClientPartyType:
            if (!clientEntityIds.includes(record.parentId.id)) {
              clientEntityIds.push(record.parentId.id)
            }
            break
          default:
        }

        switch (record.partyType) {
          case SystemPartyType:
            if (!systemEntityIds.includes(record.partyId.id)) {
              systemEntityIds.push(record.partyId.id)
            }
            break
          case CompanyPartyType:
            if (!companyEntityIds.includes(record.partyId.id)) {
              companyEntityIds.push(record.partyId.id)
            }
            break
          case ClientPartyType:
            if (!clientEntityIds.includes(record.partyId.id)) {
              clientEntityIds.push(record.partyId.id)
            }
            break
          default:
        }
      })

      // fetch system entities
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
      // fetch company entities
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
      // fetch client entities
      if (clientEntityIds.length > 0) {
        const blankQuery = new Query()
        blankQuery.limit = 0
        this.entityMap.Client = (await ClientRecordHandler.Collect(
            [
              new ListTextCriterion({
                field: 'id',
                list: clientEntityIds,
              }),
            ],
            blankQuery,
        )).records
      }
      this.updateEntityMap(party, claims.partyType)
    } catch (e) {
      this.entityMap.System = []
      this.entityMap.Client = []
      this.entityMap.Company = []
      console.error('Failed Getting Associated Party Entities', e)
      NotificationFailure('Failed Getting Associated Party Entities')
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
      user: new UserEntity(),
      selectedRowIdx: -1,
    })
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.setState({
      selectedRowIdx: rowIdx,
      user: new UserEntity(rowRecordObj),
      activeState: events.selectExisting,
    })
  }

  async handleInviteUser() {
    const {user} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteUser({
        userIdentifier: user.identifier,
      })
      NotificationSuccess('Successfully Invited User')
    } catch (e) {
      console.error('Failed to Invite User', e)
      NotificationFailure('Failed to Invite User')
    }
    HideGlobalLoader()
  }

  getPartyName(partyType, partyId) {
    const list = this.entityMap[partyType]
    const entity = retrieveFromList(partyId, list ? list : [])
    return entity ? entity.name : '-'
  }

  updateEntityMap(newEntity, entityType) {
    switch (entityType) {
      case SystemPartyType:
        if (this.getPartyName(SystemPartyType,
            new IdIdentifier(newEntity.id)) === '-') {
          this.entityMap.System.push(newEntity)
        }
        break

      case CompanyPartyType:
        if (this.getPartyName(CompanyPartyType,
            new IdIdentifier(newEntity.id)) === '-') {
          this.entityMap.Company.push(newEntity)
        }
        break

      case ClientPartyType:
        if (this.getPartyName(ClientPartyType,
            new IdIdentifier(newEntity.id)) === '-') {
          this.entityMap.Client.push(newEntity)
        }
        break

      default:
        console.error('invalid new entity party type', entityType)
    }
  }

  buildColumns() {
    const {claims} = this.props
    this.columns = [
      {
        Header: 'Username',
        accessor: 'username',
        config: {
          filter: {
            type: TextCriterionType,
          },
        },
      },
      {
        Header: 'Email Address',
        accessor: 'emailAddress',
        width: 126,
        config: {
          filter: {
            type: TextCriterionType,
          },
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        config: {
          filter: {
            type: TextCriterionType,
          },
        },
      },
      {
        Header: 'Surname',
        accessor: 'surname',
        config: {
          filter: {
            type: TextCriterionType,
          },
        },
      },
      {
        Header: 'Registered',
        accessor: 'registered',
        filterable: false,
        sortable: false,
        Cell: rowCellInfo => {
          if (rowCellInfo.value) {
            return 'Yes'
          } else {
            return 'No'
          }
        },
      },
    ]

    if (claims.partyType === SystemPartyType) {
      this.columns = [
        {
          Header: 'Party',
          accessor: 'partyId',
          width: 150,
          filterable: false,
          Cell: rowCellInfo => {
            try {
              return this.getPartyName(
                  rowCellInfo.original.partyType,
                  rowCellInfo.value,
              )
            } catch (e) {
              console.error('error getting party info', e)
              return '-'
            }
          },
        },
        {
          Header: 'Parent Party',
          accessor: 'parentId',
          width: 150,
          filterable: false,
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
          Select A User To View Or Edit
        </Typography>
    )
    switch (activeState) {
      case states.editingNew:
        cardTitle = (
            <div className={classes.detailCardTitle}>
              <Typography variant={'h6'}>
                New User
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
        <Grid
            id={'userConfigurationRoot'}
            className={classes.root}
            container direction='column'
            spacing={8}
            alignItems='center'
        >
          <Grid item xl={12}>
            <Grid container>
              <Grid item>
                <Card
                    id={'userConfigurationDetailCard'}
                    className={classes.detailCard}
                >
                  <CardHeader title={cardTitle}/>
                  <CardContent>
                    {this.renderUserDetails()}
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
                    noDataText={'No Users Found'}
                    data={records}
                    onCriteriaQueryChange={this.handleCriteriaQueryChange}
                    initialQuery={this.collectQuery}
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

  renderUserDetails() {
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
                <PersonIcon className={classes.userIcon}/>
              </Grid>
              <Grid item>
                <Fab
                    id={'userConfigurationNewUserButton'}
                    color={'primary'}
                    className={classes.button}
                    size={'small'}
                    onClick={this.handleCreateNew}
                >
                  <Tooltip title='Add New User'>
                    <AddIcon className={classes.buttonIcon}/>
                  </Tooltip>
                </Fab>
              </Grid>
            </Grid>
        )

      case states.viewingExisting:
      case states.editingNew:
      case states.editingExisting:
        const {
          user,
        } = this.state
        return <Grid
            container
            direction='column'
            spacing={8}
            alignItems={'center'}
        >
          {(claims.partyType === SystemPartyType) &&
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
                    value={user.parentPartyType}
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
                  value={{
                    label: this.getPartyName(
                        user.parentPartyType,
                        user.parentId,
                    ),
                    value: user.partyId,
                  }}
                  loadOptions={this.loadParentPartyOptions}
                  onChange={this.handleFieldChange}
              />
            </Grid>
            <Grid item>
              <FormControl
                  className={classes.formField}
                  error={!!fieldValidations.parentPartyType}
                  aria-describedby='partyType'
              >
                <InputLabel htmlFor='partyType'>
                  Party Type
                </InputLabel>
                <Select
                    id='partyType'
                    name='partyType'
                    value={user.partyType}
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
                    <FormHelperText id='partyType'>
                      {fieldValidations.partyType
                          ? fieldValidations.partyType.help
                          : undefined}
                    </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item>
              <AsyncSelect
                  cacheOptions
                  name={'partyId'}
                  disabled={stateIsViewing}
                  ExtraTextFieldProps={{
                    label: 'Party',
                    InputLabelProps: {
                      shrink: true,
                    },
                    InputProps: {
                      disableUnderline: stateIsViewing,
                      readOnly: stateIsViewing,
                    },
                    helperText:
                        fieldValidations.partyId
                            ? fieldValidations.partyId.help
                            : undefined,
                    error: !!fieldValidations.partyId,
                  }}
                  value={{
                    label: this.getPartyName(
                        user.partyType,
                        user.partyId,
                    ),
                    value: user.partyId,
                  }}
                  loadOptions={this.loadPartyOptions}
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
                value={user.name}
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
                id='surname'
                label='Surname'
                value={user.surname}
                onChange={this.handleFieldChange}
                InputProps={{
                  disableUnderline: stateIsViewing,
                  readOnly: stateIsViewing,
                }}
                helperText={
                  fieldValidations.surname
                      ? fieldValidations.surname.help
                      : undefined
                }
                error={!!fieldValidations.surname}
            />
          </Grid>
          <Grid item>
            <TextField
                className={classes.formField}
                id='username'
                label='Username'
                value={user.username}
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
          </Grid>
          <Grid item>
            <TextField
                className={classes.formField}
                id='emailAddress'
                label='emailAddress'
                value={user.emailAddress}
                onChange={this.handleFieldChange}
                InputProps={{
                  disableUnderline: stateIsViewing,
                  readOnly: stateIsViewing,
                }}
                helperText={
                  fieldValidations.emailAddress
                      ? fieldValidations.emailAddress.help
                      : undefined
                }
                error={!!fieldValidations.emailAddress}
            />
          </Grid>
        </Grid>

      default:
    }

  }

  renderControlIcons() {
    const {activeState, user} = this.state
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
              {(!user.registered) &&
              <Fab
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleInviteUser}
              >
                <Tooltip title='Invite User'>
                  <SendEmailIcon className={classes.buttonIcon}/>
                </Tooltip>
              </Fab>}
              <Fab
                  id={'userConfigurationNewUserButton'}
                  className={classes.button}
                  size={'small'}
                  onClick={this.handleCreateNew}
              >
                <Tooltip title='Add New User'>
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
                <Tooltip title='Save New User'>
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

User = withStyles(styles, {withTheme: true})(User)

User.propTypes = {
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

User.defaultProps = {}

export default User