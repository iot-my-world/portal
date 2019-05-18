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

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  buttonIcon: {
    fontSize: '20px',
  },
})

const states = {
  viewingExisting: 1,
  editingNew: 2,
  editingExisting: 3,
}

const events = {
  init: states.viewingExisting,

  startCreateNew: states.editingNew,
  cancelCreateNew: states.nop,
  createNewSuccess: states.nop,

  startEditExisting: states.editingExisting,
  finishEditExisting: states.viewingExisting,
  cancelEditExisting: states.viewingExisting,
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
      activeState: events.init,

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
    zx303Tracker[fieldName] = e.target.value

    switch (fieldName) {
      case 'ownerPartyType':
        zx303Tracker.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          zx303Tracker.ownerPartyType,
        )
        break

      case 'assignedPartyType':
        zx303Tracker.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        this.partyHolder.update(
          e.selectionInfo.entity,
          zx303Tracker.assignedPartyType,
        )
        break

      default:
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({zx303Tracker})
  }

  renderControlIcons = () => {
    const {activeState} = this.state
    const {classes} = this.props

    switch (activeState) {
      case states.viewingExisting:
        return [
          (
            <Fab size={'medium'}>
              <Tooltip title='Edit'>
                <EditIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case states.editingNew:
        return [
          (
            <Fab size={'medium'}>
              <Tooltip title='Save New'>
                <SaveIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case states.editingExisting:
        return [
          (
            <Fab size={'medium'}>
              <Tooltip title='Save Changes'>
                <SaveIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
          (
            <Fab size={'medium'}>
              <Tooltip title='Cancel'>
                <CancelIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          ),
        ]

      case states.nop:
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
    const stateIsViewing = activeState === states.viewingExisting

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
}
Detail.defaultProps = {}

Detail = withStyles(styles)(Detail)

export default Detail