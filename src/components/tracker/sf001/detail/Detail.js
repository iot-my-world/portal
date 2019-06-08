import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  FormControl, FormHelperText,
  Grid, InputLabel, MenuItem, Select, TextField,
  withStyles, Fab, Tooltip,
} from '@material-ui/core'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import Dialog from 'components/Dialog'
import {
  allPartyTypes, ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'
import AsyncSelect from 'components/form/newasyncSelect/AsyncSelect'
import PartyHolder from 'brain/party/holder/Holder'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import SystemRecordHandler from 'brain/party/system/RecordHandler'
import TextCriterion from 'brain/search/criterion/Text'
import IdIdentifier from 'brain/search/identifier/Id'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'
import ClientRecordHandler from 'brain/party/client/RecordHandler'
import {
  CancelIcon,
  EditIcon,
  SaveIcon,
} from 'components/icon'
import {
  SF001Tracker,
  SF001TrackerValidator,
  SF001TrackerAdministrator,
} from 'brain/tracker/sf001'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
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

class Detail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeState: props.initialActiveState,

      sf001Tracker: new SF001Tracker(props.sf001Tracker),
      sf001TrackerCopy: new SF001Tracker(),
    }
  }

  componentDidMount() {
    this.load()
  }

  partyHolder = new PartyHolder()
  reasonsInvalid = new ReasonsInvalid()

  load = async () => {
    const {party, claims, NotificationFailure} = this.props
    const {sf001Tracker} = this.state
    try {
      await this.partyHolder.load(
        [sf001Tracker],
        'ownerPartyType',
        'ownerId',
      )
      await this.partyHolder.load(
        [sf001Tracker],
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
    }
  }

  handleFieldChange = e => {
    let {sf001Tracker} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id

    switch (fieldName) {
      case 'ownerPartyType':
        sf001Tracker[fieldName] = e.target.value
        sf001Tracker.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        if (e.target.value === '') {
          sf001Tracker[fieldName] = new IdIdentifier()
        } else {
          sf001Tracker[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            sf001Tracker.ownerPartyType,
          )
        }
        break

      case 'assignedPartyType':
        sf001Tracker[fieldName] = e.target.value
        sf001Tracker.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        if (e.target.value === '') {
          sf001Tracker[fieldName] = new IdIdentifier()
        } else {
          sf001Tracker[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            sf001Tracker.ownerPartyType,
          )
        }
        break

      default:
        sf001Tracker[fieldName] = e.target.value
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({sf001Tracker})
  }

  handleSaveNew = async () => {
    const {sf001Tracker} = this.state
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
      const reasonsInvalid = (await SF001TrackerValidator.Validate({
        sf001: sf001Tracker,
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
      const createResponse = await SF001TrackerAdministrator.Create({
        sf001: sf001Tracker,
      })
      NotificationSuccess('Successfully Created Device')
      this.setState({
        sf001Tracker: createResponse.sf001,
        activeState: events.createNewSuccess,
      })
    } catch (e) {
      console.error('Error Creating Device', e)
      NotificationFailure('Error Creating Device')
      HideGlobalLoader()
      return
    }
    HideGlobalLoader()
  }

  handleStartEditExisting = () => {
    this.reasonsInvalid.clearAll()
    const {sf001Tracker} = this.state
    this.setState({
      sf001TrackerCopy: new SF001Tracker(sf001Tracker),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {sf001TrackerCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      sf001Tracker: new SF001Tracker(sf001TrackerCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {sf001Tracker} = this.state
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
      const reasonsInvalid = (await SF001TrackerValidator.Validate({
        sf001: sf001Tracker,
        action: 'Update',
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

    // perform update
    try {
      const response = await SF001TrackerAdministrator.UpdateAllowedFields({
        sf001: sf001Tracker,
      })
      this.setState({
        sf001Tracker: response.sf001,
        activeState: events.finishEditExisting,
      })
    } catch (e) {
      console.error('Error Updating Device', e)
      NotificationFailure('Error Updating Device')
      HideGlobalLoader()
      return
    }

    NotificationSuccess('Successfully Updated Device')
    HideGlobalLoader()
  }

  renderControlIcons = () => {
    const {activeState} = this.state
    const {classes} = this.props

    switch (activeState) {
      case activeStates.viewingExisting:
        return [
          (
            <Fab
              size={'small'}
              onClick={this.handleStartEditExisting}
            >
              <Tooltip title='Edit'>
                <EditIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case activeStates.editingNew:
        return [
          (
            <Fab
              size={'small'}
              onClick={this.handleSaveNew}
            >
              <Tooltip title='Save New'>
                <SaveIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case activeStates.editingExisting:
        return [
          (
            <Fab
              size={'small'}
              onClick={this.handleSaveChanges}
            >
              <Tooltip title='Save Changes'>
                <SaveIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
          (
            <Fab
              size={'small'}
              onClick={this.handleCancelEditExisting}
            >
              <Tooltip title='Cancel'>
                <CancelIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case activeStates.nop:
      default:
        return []
    }
  }

  render() {
    const {
      open,
      closeDialog,
      classes,
    } = this.props
    const {sf001Tracker, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'SF001 Tracker'}
        additionalTitleControls={this.renderControlIcons()}
      >
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
                value={sf001Tracker.ownerPartyType}
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
                value: sf001Tracker.ownerId,
                label: this.partyHolder.retrieveEntityProp(
                  'name',
                  sf001Tracker.ownerId,
                ),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(
                sf001Tracker.ownerPartyType)}
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
                value={sf001Tracker.assignedPartyType}
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
                value: sf001Tracker.assignedId,
                label: this.partyHolder.retrieveEntityProp(
                  'name',
                  sf001Tracker.assignedId,
                ),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(
                sf001Tracker.assignedPartyType)}
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
              id='deviceId'
              label='Device Id'
              value={sf001Tracker.deviceId}
              onChange={this.handleFieldChange}
              InputProps={{
                disableUnderline: stateIsViewing,
                readOnly: stateIsViewing,
              }}
              helperText={
                fieldValidations.deviceId
                  ? fieldValidations.deviceId.help
                  : undefined
              }
              error={!!fieldValidations.deviceId}
            />
          </Grid>
        </Grid>
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
   * the sf001 tracker being viewed or edited
   */
  sf001Tracker: PropTypes.instanceOf(SF001Tracker),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}