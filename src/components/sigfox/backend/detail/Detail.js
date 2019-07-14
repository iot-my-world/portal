import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  TextField, withStyles, Fab, Tooltip,
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
  Backend,
  BackendValidator,
  BackendAdministrator,
} from 'brain/sigfox/backend'
import PartyRegistrar from 'brain/party/registrar/Registrar'
import PartyIdentifier from 'brain/search/identifier/Party'
import IdIdentifier from 'brain/search/identifier/Id'

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

      backend: new Backend(props.backend),
      backendCopy: new Backend(),
    }
  }

  componentDidMount() {
    this.load()
  }

  partyHolder = new PartyHolder()
  reasonsInvalid = new ReasonsInvalid()
  backendRegistration = false

  load = async () => {
    const {
      party, claims, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props
    const {
      backend, activeState,
    } = this.state
    ShowGlobalLoader()
    try {
      await this.partyHolder.load(
        [backend],
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
        this.backendRegistration = (await PartyRegistrar.AreAdminsRegistered({
          partyIdentifiers: [
            new PartyIdentifier({
              partyIdIdentifier: new IdIdentifier(backend.id),
              partyType: BackendPartyType,
            })
          ],
        })).result[backend.id]
      } catch (e) {
        console.error(`error determining admin registration status records: ${e}`)
        NotificationFailure('Error Determining Admin Registration Status')
        HideGlobalLoader()
        return
      }
    }

    HideGlobalLoader()
  }

  handleFieldChange = e => {
    let {backend} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id
    backend[fieldName] = e.target.value
    this.reasonsInvalid.clearField(fieldName)
    this.setState({backend})
  }

  handleSaveNew = async () => {
    const {backend} = this.state
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
      const reasonsInvalid = (await BackendValidator.Validate({
        backend: backend,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Backend', e)
      NotificationFailure('Error Validating Backend')
      HideGlobalLoader()
      return
    }

    // perform creation
    try {
      const createResponse = await BackendAdministrator.Create({
        backend: backend,
      })
      NotificationSuccess('Successfully Created Backend')
      this.setState({
        backend: createResponse.backend,
        activeState: events.createNewSuccess,
      })
    } catch (e) {
      console.error('Error Creating Backend', e)
      NotificationFailure('Error Creating Backend')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleInviteAdmin = async () => {
    const {backend} = this.state
    const {
      NotificationSuccess, NotificationFailure,
      ShowGlobalLoader, HideGlobalLoader,
    } = this.props

    ShowGlobalLoader()
    try {
      // perform the invite
      await PartyRegistrar.InviteBackendAdminUser({
        backendIdentifier: backend.identifier,
      })
      NotificationSuccess('Backend Admin User Invited')
    } catch (e) {
      console.error('Failed to Invite Backend Admin User', e)
      NotificationFailure('Failed to Invite Backend Admin User')
    }
    HideGlobalLoader()
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {backend} = this.state
    this.setState({
      backendCopy: new Backend(backend),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {backendCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      backend: new Backend(backendCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {backend} = this.state
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
      const reasonsInvalid = (await BackendValidator.Validate({
        backend: backend,
        action: 'Update',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating Backend', e)
      NotificationFailure('Error Validating Backend')
      HideGlobalLoader()
      return
    }

    // perform update
    try {
      const response = await BackendAdministrator.UpdateAllowedFields({
        backend: backend,
      })
      this.setState({
        backend: response.backend,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating Backend', e)
      NotificationFailure('Error Updating Backend')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated Backend')
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
        if (!this.backendRegistration) {
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
          ...controlIcons
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
    } = this.props
    const {backend, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting
    const stateIsCreateNew = activeState === activeStates.editingNew

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'Backend'}
        additionalTitleControls={this.renderControlIcons()}
        fullScreen={false}
      >
        <div className={classes.root}>
          <TextField
            className={classes.formField}
            id='name'
            label='Name'
            value={backend.name}
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
            value={backend.adminEmailAddress}
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
   * the backend tracker being viewed or edited
   */
  backend: PropTypes.instanceOf(Backend),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}