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
  Company,
  CompanyValidator,
  CompanyAdministrator,
} from 'brain/party/company'

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

      company: new Company(props.company),
      sf001TrackerCopy: new Company(),
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
    const {company} = this.state
    ShowGlobalLoader()
    try {
      await this.partyHolder.load(
        [company],
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
    }
    HideGlobalLoader()
  }

  handleFieldChange = e => {
    let {company} = this.state
    const fieldName = e.target.name ? e.target.name : e.target.id

    switch (fieldName) {
      case 'ownerPartyType':
        company[fieldName] = e.target.value
        company.ownerId = new IdIdentifier()
        break

      case 'ownerId':
        if (e.target.value === '') {
          company[fieldName] = new IdIdentifier()
        } else {
          company[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            company.ownerPartyType,
          )
        }
        break

      case 'assignedPartyType':
        company[fieldName] = e.target.value
        company.assignedId = new IdIdentifier()
        break

      case 'assignedId':
        if (e.target.value === '') {
          company[fieldName] = new IdIdentifier()
        } else {
          company[fieldName] = e.target.value
          this.partyHolder.update(
            e.selectionInfo.entity,
            company.ownerPartyType,
          )
        }
        break

      default:
        company[fieldName] = e.target.value
    }

    this.reasonsInvalid.clearField(fieldName)
    this.setState({company})
  }

  handleSaveNew = async () => {
    const {company} = this.state
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
      const reasonsInvalid = (await CompanyValidator.Validate({
        company: company,
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
      const createResponse = await CompanyAdministrator.Create({
        company: company,
      })
      NotificationSuccess('Successfully Created Device')
      this.setState({
        company: createResponse.company,
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
    const {company} = this.state
    this.setState({
      sf001TrackerCopy: new Company(company),
      activeState: events.startEditExisting,
    })
  }
  handleCancelEditExisting = () => {
    const {sf001TrackerCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      company: new Company(sf001TrackerCopy),
      activeState: events.cancelEditExisting,
    })
  }
  handleSaveChanges = async () => {
    const {company} = this.state
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
      const reasonsInvalid = (await CompanyValidator.Validate({
        company: company,
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
      const response = await CompanyAdministrator.UpdateAllowedFields({
        company: company,
      })
      this.setState({
        company: response.company,
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
            <Tooltip title='Edit'>
              <Fab
                size={'small'}
                onClick={this.handleStartEditExisting}
              >
                <EditIcon className={classes.buttonIcon}/>
              </Fab>
            </Tooltip>
          ),
        ]

      case activeStates.editingNew:
        return [
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
        ]

      case activeStates.editingExisting:
        return [
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
    const {company, activeState} = this.state

    const fieldValidations = this.reasonsInvalid.toMap()
    const stateIsViewing = activeState === activeStates.viewingExisting

    return (
      <Dialog
        open={open}
        closeDialog={closeDialog}
        title={'Company'}
        additionalTitleControls={this.renderControlIcons()}
      >
        <Grid container spacing={1}>
          <Grid item xs>
            <TextField
              className={classes.formField}
              id='name'
              label='Name'
              value={company.name}
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
   * the company tracker being viewed or edited
   */
  company: PropTypes.instanceOf(Company),
  initialActiveState: PropTypes.oneOf(Object.values(activeStates)),
}
Detail.defaultProps = {
  initialActiveState: activeStates.editingNew,
}

Detail = withStyles(styles)(Detail)

export default Detail
export {activeStates}