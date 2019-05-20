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
  ZX303 as ZX303Device,
  ZX303 as ZX303Tracker,
} from 'brain/tracker/zx303/index'
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
  MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
import ZX303DeviceValidator from 'brain/tracker/zx303/Validator'
import ZX303DeviceAdministrator from 'brain/tracker/zx303/Administrator'

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

      zx303Tracker: new ZX303Tracker(props.zx303Tracker),
      zx303TrackerCopy: new ZX303Tracker(),
    }
  }

  componentDidMount() {
    this.load()
  }

  partyHolder = new PartyHolder()
  reasonsInvalid = new ReasonsInvalid()

  load = async () => {
    const {party, claims, NotificationFailure} = this.props
    const {zx303Tracker} = this.state
    try {
      await this.partyHolder.load(
        [zx303Tracker],
        'ownerPartyType',
        'ownerId',
      )
      await this.partyHolder.load(
        [zx303Tracker],
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
    let {zx303Tracker} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id

    switch (fieldName) {
      case 'ownerPartyType':
        zx303Tracker[fieldName] = e.target.value
        zx303Tracker.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        if (e.target.value === '') {
          zx303Tracker[fieldName] = new IdIdentifier()
        } else {
          zx303Tracker[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            zx303Tracker.ownerPartyType,
          )
        }
        break

      case 'assignedPartyType':
        zx303Tracker[fieldName] = e.target.value
        zx303Tracker.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        if (e.target.value === '') {
          zx303Tracker[fieldName] = new IdIdentifier()
        } else {
          zx303Tracker[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            zx303Tracker.ownerPartyType,
          )
        }
        break

      default:
        zx303Tracker[fieldName] = e.target.value
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({zx303Tracker})
  }

  handleSaveNew = async () => {
    const {zx303Tracker} = this.state
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
      const reasonsInvalid = (await ZX303DeviceValidator.Validate({
        zx303: zx303Tracker,
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
      const createResponse = await ZX303DeviceAdministrator.Create({
        zx303: zx303Tracker,
      })
      NotificationSuccess('Successfully Created Device')
      this.setState({
        zx303Tracker: createResponse.zx303,
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
    const {zx303Tracker} = this.state
    this.setState({
      zx303TrackerCopy: new ZX303Device(zx303Tracker),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {zx303TrackerCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      zx303Tracker: new ZX303Device(zx303TrackerCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {zx303Tracker} = this.state
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
      const reasonsInvalid = (await ZX303DeviceValidator.Validate({
        zx303: zx303Tracker,
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
      const response = await ZX303DeviceAdministrator.UpdateAllowedFields({
        zx303: zx303Tracker,
      })
      this.setState({
        zx303Tracker: response.zx303,
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
    const {zx303Tracker, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'ZX303 Tracker'}
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
                value={zx303Tracker.ownerPartyType}
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
                value: zx303Tracker.ownerId,
                label: this.partyHolder.retrieveEntityProp(
                  'name',
                  zx303Tracker.ownerId,
                ),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(
                zx303Tracker.ownerPartyType)}
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
                value={zx303Tracker.assignedPartyType}
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
                value: zx303Tracker.assignedId,
                label: this.partyHolder.retrieveEntityProp(
                  'name',
                  zx303Tracker.assignedId,
                ),
              }}
              onChange={this.handleFieldChange}
              loadOptions={loadPartyOptions(
                zx303Tracker.assignedPartyType)}
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
              value={zx303Tracker.simCountryCode}
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
              value={zx303Tracker.simNumber}
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
              value={zx303Tracker.imei}
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
   * the zx303 tracker being viewed or edited
   */
  zx303Tracker: PropTypes.instanceOf(ZX303Tracker),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}