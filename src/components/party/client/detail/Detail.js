import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  TextField,
  withStyles,
  Fab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem, FormHelperText,
} from '@material-ui/core'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import Dialog from 'components/Dialog'
import PartyHolder from 'brain/party/holder/Holder'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import {
  CancelIcon,
  EditIcon,
  SaveIcon,
  EmailIcon,
} from 'components/icon'
import {
  Client,
  ClientValidator,
  ClientAdministrator,
} from 'brain/party/client'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import PartyIdentifier from 'brain/search/identifier/Party'
import IdIdentifier from 'brain/search/identifier/Id'
import {
  allPartyTypes,
  ClientPartyType, CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import {AllClientTypes} from 'brain/party/client/types'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import SystemRecordHandler from 'brain/party/system/RecordHandler'
import TextCriterion from 'brain/search/criterion/Text'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'
import ClientRecordHandler from 'brain/party/client/RecordHandler'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formField: {
    height: '60px',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: `calc(100% - ${theme.spacing(1)}px)`,
    },
    [theme.breakpoints.up('md')]: {
      width: '300px',
    },
  },
  buttonIcon: {
    fontSize: '20px',
  },
})

const loadPartyOptions = partyType => async (inputValue, callback) => {
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

const activeStates = {
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  init: activeStates.viewingExisting,

  createNewSuccess: activeStates.viewingExisting,

  startEditExisting: activeStates.editingExisting,
  cancelEditExisting: activeStates.viewingExisting,
  finishEditExisting: activeStates.viewingExisting,
}

class Detail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeState: props.initialActiveState,

      client: new Client(props.client),
      clientCopy: new Client(),
    }
  }

  componentDidMount() {
    this.load()
  }

  partyHolder = new PartyHolder()
  reasonsInvalid = new ReasonsInvalid()
  clientRegistration = false

  load = async () => {
    const {
      party, claims, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props
    const {
      client, activeState,
    } = this.state
    ShowGlobalLoader()
    try {
      await this.partyHolder.load(
        [client],
        'parentPartyType',
        'parentId',
      )
      this.partyHolder.update(
        party,
        claims.partyType,
      )
    } catch (e) {
      console.error('Error Loading Associated Parties', e)
      NotificationFailure('Error Loading Associated Parties')
      HideGlobalLoader()
      return
    }

    if (activeState !== activeStates.editingNew) {
      try {
        // find the admin user registration status of these companies
        this.clientRegistration = (await PartyRegistrar.AreAdminsRegistered({
          partyIdentifiers: [
            new PartyIdentifier({
              partyIdIdentifier: new IdIdentifier(client.id),
              partyType: ClientPartyType,
            }),
          ],
        })).result[client.id]
      } catch (e) {
        console.error(
          `error determining admin registration status records: ${e}`)
        NotificationFailure('Error Determining Admin Registration Status')
        HideGlobalLoader()
        return
      }
    }

    HideGlobalLoader()
  }

  handleFieldChange = e => {
    let {client} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    client[fieldName] = e.target.value
    this.reasonsInvalid.clearField(fieldName)

    switch (fieldName) {
      case 'parentPartyType':
        client.parentId = new IdIdentifier()
        break

      case 'parentId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          client.parentPartyType,
        )
        break

      default:
    }

    this.setState({client})
  }

  handleSaveNew = async () => {
    const {client} = this.state
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
      const reasonsInvalid = (await ClientValidator.Validate({
        client: client,
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

    // perform creation
    try {
      const createResponse = await ClientAdministrator.Create({
        client: client,
      })
      NotificationSuccess('Successfully Created Client')
      this.setState({
        client: createResponse.client,
        activeState: events.createNewSuccess,
      })
    } catch (e) {
      console.error('Error Creating Client', e)
      NotificationFailure('Error Creating Client')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleInviteAdmin = async () => {
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
      NotificationSuccess('Client Admin User Invited')
    } catch (e) {
      console.error('Failed to Invite Client Admin User', e)
      NotificationFailure('Failed to Invite Client Admin User')
    }
    HideGlobalLoader()
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {client} = this.state
    this.setState({
      clientCopy: new Client(client),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {clientCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      client: new Client(clientCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {client} = this.state
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
      const reasonsInvalid = (await ClientValidator.Validate({
        client: client,
        action: 'Update',
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

    // perform update
    try {
      const response = await ClientAdministrator.UpdateAllowedFields({
        client: client,
      })
      this.setState({
        client: response.client,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating Client', e)
      NotificationFailure('Error Updating Client')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated Client')
    HideGlobalLoader()
  }

  renderControlIcons = () => {
    const {activeState} = this.state
    const {classes} = this.props

    let controlIcons = []

    switch (activeState) {
      case activeStates.viewingExisting:
        controlIcons = [
          (
            <Tooltip title='Edit'>
              <Fab
                size={'small'}
                onClick={this.handleStartEditExisting}
              >
                <EditIcon className={classes.buttonIcon}/>
              </Fab>
            </Tooltip>
          ),
          ...controlIcons,
        ]
        if (!this.clientRegistration) {
          controlIcons = [
            (
              <Tooltip title='Invite Admin'>
                <Fab
                  size={'small'}
                  onClick={this.handleInviteAdmin}
                >
                  <EmailIcon className={classes.buttonIcon}/>
                </Fab>
              </Tooltip>
            ),
            ...controlIcons,
          ]
        }
        break

      case activeStates.editingNew:
        controlIcons = [
          (
            <Tooltip title='Save New'>
              <Fab
                size={'small'}
                onClick={this.handleSaveNew}
              >
                <SaveIcon className={classes.buttonIcon}/>
              </Fab>
            </Tooltip>
          ),
          ...controlIcons,
        ]
        break

      case activeStates.editingExisting:
        controlIcons = [
          (
            <Tooltip title='Save Changes'>
              <Fab
                size={'small'}
                onClick={this.handleSaveChanges}
              >
                <SaveIcon className={classes.buttonIcon}/>
              </Fab>
            </Tooltip>
          ),
          (
            <Tooltip title='Cancel'>
              <Fab
                size={'small'}
                onClick={this.handleCancelEditExisting}
              >
                <CancelIcon className={classes.buttonIcon}/>
              </Fab>
            </Tooltip>
          ),
          ...controlIcons,
        ]
        break

      case activeStates.nop:
      default:
        return []
    }

    return controlIcons
  }

  render() {
    const {
      open,
      closeDialog,
      classes,
      claims,
    } = this.props
    const {client, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting
    const stateIsCreateNew = activeState === activeStates.editingNew

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'Client'}
        additionalTitleControls={this.renderControlIcons()}
        fullScreen={false}
      >
        <div className={classes.root}>
          {(claims.partyType === SystemPartyType) &&
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
            {!!fieldValidations.parentPartyType && (
              <FormHelperText id='parentPartyType'>
                {
                  fieldValidations.parentPartyType ?
                    fieldValidations.parentPartyType.help :
                    undefined
                }
              </FormHelperText>
            )}
          </FormControl>}
          {(claims.partyType === SystemPartyType) &&
          <AsyncSelect
            id='parentId'
            label={'Parent'}
            blankValue={new IdIdentifier()}
            value={{
              value: client.ownerId,
              label: (() => {
                return this.partyHolder.retrieveEntityProp(
                  'name',
                  client.parentId,
                )
              })(),
            }}
            onChange={this.handleFieldChange}
            loadOptions={loadPartyOptions(client.parentPartyType)}
            menuPosition={'fixed'}
            readOnly={stateIsViewing}
            helperText={
              fieldValidations.parentId
                ? fieldValidations.parentId.help
                : undefined
            }
            error={!!fieldValidations.parentId}
          />}
          <FormControl
            className={classes.formField}
            error={!!fieldValidations.type}
            aria-describedby='type'
          >
            <InputLabel htmlFor='type'>
              Client Type
            </InputLabel>
            <Select
              id='type'
              name='type'
              value={client.type}
              onChange={this.handleFieldChange}
              style={{width: 150}}
              disableUnderline={stateIsViewing}
              inputProps={{readOnly: stateIsViewing}}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {AllClientTypes.map((partyType, idx) => {
                return (
                  <MenuItem key={idx} value={partyType}>
                    {partyType}
                  </MenuItem>
                )
              })}
            </Select>
            {!!fieldValidations.type && (
              <FormHelperText id='type'>
                {
                  fieldValidations.type ?
                    fieldValidations.type.help :
                    undefined
                }
              </FormHelperText>
            )}
          </FormControl>
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
          <TextField
            className={classes.formField}
            id='adminEmailAddress'
            label='Admin Email Address'
            value={client.adminEmailAddress}
            onChange={this.handleFieldChange}
            InputProps={{
              disableUnderline: !stateIsCreateNew,
              readOnly: !stateIsCreateNew,
            }}
            helperText={
              fieldValidations.adminEmailAddress
                ? fieldValidations.adminEmailAddress.help
                : undefined
            }
            error={!!fieldValidations.adminEmailAddress}
          />
        </div>
      </Dialog>
    )

  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * boolean indicating if the detail dialog should be open
   */
  open: PropTypes.bool.isRequired,
  /**
   * function which can be called to close the detail dialog
   */
  closeDialog: PropTypes.func.isRequired,
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
   * the client tracker being viewed or edited
   */
  client: PropTypes.instanceOf(Client),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}