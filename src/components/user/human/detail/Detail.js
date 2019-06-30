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
import Dialog from 'components/Dialog/index'
import PartyHolder from 'brain/party/holder/Holder'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import {
  CancelIcon,
  EditIcon,
  SaveIcon,
  EmailIcon,
} from 'components/icon/index'
import {
  User,
  UserValidator,
  UserAdministrator,
} from 'brain/user/human/index'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import IdIdentifier from 'brain/search/identifier/Id'
import {
  allPartyTypes,
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import SystemRecordHandler from 'brain/party/system/RecordHandler'
import TextCriterion from 'brain/search/criterion/Text'
import {
  CompanyRecordHandler,
} from 'brain/party/company/index'
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
      collectResponse = await SystemRecordHandler.Collect({
        criteria: [
          new TextCriterion({
            field: 'name',
            text: inputValue,
          }),
        ],
      })
      callbackResults = collectResponse.records.map(system => ({
        label: system.name,
        value: new IdIdentifier(system.id),
        entity: system,
      }))
      break

    case CompanyPartyType:
      collectResponse = await CompanyRecordHandler.Collect({
          criteria: [
            new TextCriterion({
              field: 'name',
              text: inputValue,
            }),
          ],
        },
      )
      callbackResults = collectResponse.records.map(company => ({
        label: company.name,
        value: new IdIdentifier(company.id),
        entity: company,
      }))
      break

    case ClientPartyType:
      collectResponse = await ClientRecordHandler.Collect({
        criteria: [
          new TextCriterion({
            field: 'name',
            text: inputValue,
          }),
        ],
      })
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

      user: new User(props.user),
      userCopy: new User(),
    }
  }

  componentDidMount() {
    this.load()
  }

  partyHolder = new PartyHolder()
  reasonsInvalid = new ReasonsInvalid()

  load = async () => {
    const {
      party, claims, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props
    const {user} = this.state
    ShowGlobalLoader()
    try {
      await this.partyHolder.load(
        [user],
        'parentPartyType',
        'parentId',
      )
      await this.partyHolder.load(
        [user],
        'partyType',
        'partyId',
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

    HideGlobalLoader()
  }

  handleFieldChange = e => {
    let {user} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    user[fieldName] = e.target.value
    this.reasonsInvalid.clearField(fieldName)

    switch (fieldName) {
      case 'parentPartyType':
        user.parentId = new IdIdentifier()
        break

      case 'parentId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          user.parentPartyType,
        )
        break

      default:
    }

    this.setState({user})
  }

  handleSaveNew = async () => {
    const {user} = this.state
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
      const reasonsInvalid = (await UserValidator.Validate({
        user: user,
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

    // perform creation
    try {
      const createResponse = await UserAdministrator.Create({
        user: user,
      })
      NotificationSuccess('Successfully Created User')
      this.setState({
        user: createResponse.user,
        activeState: events.createNewSuccess,
      })
    } catch (e) {
      console.error('Error Creating User', e)
      NotificationFailure('Error Creating User')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleInviteUser = async () => {
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
      NotificationSuccess('User Invited')
    } catch (e) {
      console.error('Failed to Invite User', e)
      NotificationFailure('Failed to Invite User')
    }
    HideGlobalLoader()
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {user} = this.state
    this.setState({
      userCopy: new User(user),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {userCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      user: new User(userCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {user} = this.state
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
      const reasonsInvalid = (await UserValidator.Validate({
        user: user,
        action: 'Update',
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

    // perform update
    try {
      const response = await UserAdministrator.UpdateAllowedFields({
        user: user,
      })
      this.setState({
        user: response.user,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating User', e)
      NotificationFailure('Error Updating User')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated User')
    HideGlobalLoader()
  }

  renderControlIcons = () => {
    const {
      activeState, user,
    } = this.state
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
        if (!user.registered) {
          controlIcons = [
            (
              <Tooltip title='Invite User'>
                <Fab
                  size={'small'}
                  onClick={this.handleInviteUser}
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
    const {user, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'User'}
        additionalTitleControls={this.renderControlIcons()}
        fullScreen={false}
      >
        <div className={classes.root}>
          {(claims.partyType === SystemPartyType) &&
          <React.Fragment>
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
              {!!fieldValidations.parentPartyType && (
                <FormHelperText id='parentPartyType'>
                  {
                    fieldValidations.parentPartyType ?
                      fieldValidations.parentPartyType.help :
                      undefined
                  }
                </FormHelperText>
              )}
            </FormControl>
            <AsyncSelect
              id='parentId'
              label={'Parent'}
              blankValue={new IdIdentifier()}
              value={{
                value: user.ownerId,
                label: (() => {
                  return this.partyHolder.retrieveEntityProp(
                    'name',
                    user.parentId,
                  )
                })(),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(user.parentPartyType)}
              menuPosition={'fixed'}
              readOnly={stateIsViewing}
              helperText={
                fieldValidations.parentId
                  ? fieldValidations.parentId.help
                  : undefined
              }
              error={!!fieldValidations.parentId}
            />
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
            <AsyncSelect
              id='partyId'
              label={'Party'}
              blankValue={new IdIdentifier()}
              value={{
                value: user.ownerId,
                label: (() => {
                  return this.partyHolder.retrieveEntityProp(
                    'name',
                    user.partyId,
                  )
                })(),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(user.partyId)}
              menuPosition={'fixed'}
              readOnly={stateIsViewing}
              helperText={
                fieldValidations.partyId
                  ? fieldValidations.partyId.help
                  : undefined
              }
              error={!!fieldValidations.partyId}
            />
          </React.Fragment>}
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
          <TextField
            className={classes.formField}
            id='emailAddress'
            label='Email Address'
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
   * the user tracker being viewed or edited
   */
  user: PropTypes.instanceOf(User),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}