import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  CardHeader, TextField, Fab, Tooltip,
} from '@material-ui/core'
import ClientPartyAdministrator from 'brain/party/client/Administrator'
import CompanyPartyAdministrator from 'brain/party/company/Administrator'
import ClientParty from 'brain/party/client/Client'
import SystemParty from 'brain/party/system/System'
import CompanyParty from 'brain/party/company/Company'

import {
  MdClear as CancelIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
} from 'react-icons/md'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import ClientPartyValidator from 'brain/party/client/Validator'
import CompanyPartyValidator from 'brain/party/company/Validator'

const styles = theme => ({
  detailCard: {},
  detailCardTitle: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: '1fr',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing.unit,
  },
})

const states = {
  nop: 0,
  editing: 1,
}

const events = {
  init: states.nop,
  startEditing: states.editing,
  saveChanges: states.nop,
  cancelEditing: states.nop,
}

class General extends Component {
  constructor(props) {
    super(props)
    this.handleStartEditing = this.handleStartEditing.bind(this)
    this.renderControlIcons = this.renderControlIcons.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)

    this.PartyAdministrator = (() => {
      switch (props.party.constructor) {
        case ClientParty:
          return ClientPartyAdministrator
        case CompanyParty:
          return CompanyPartyAdministrator
        case SystemParty:
          return () => {console.log('system does not have and administrator')}
        default:
          return () => {console.log('no validator for this party type')}
      }
    })()
    this.PartyValidator = (() => {
      switch (props.party.constructor) {
        case ClientParty:
          return ClientPartyValidator
        case CompanyParty:
          return CompanyPartyValidator
        case SystemParty:
          return () => {console.log('system does not have and validator')}
        default:
          return () => {console.log('no validator for this party type')}
      }
    })()
    this.party = props.party.constructor

    this.state = {
      party: new this.party(this.props.party),
      partyCopy: new this.party(this.props.party),
      activeState: events.init,
    }
  }

  reasonsInvalid = new ReasonsInvalid()

  handleStartEditing() {
    const {party} = this.state
    this.setState({
      partyCopy: new this.party(party),
      activeState: events.startEditing,
    })
  }

  async handleSaveChanges() {
    const {party} = this.state
    const {SetMyParty} = this.props
    const {
      ShowGlobalLoader,
      HideGlobalLoader,
      NotificationSuccess,
      NotificationFailure,
    } = this.props

    ShowGlobalLoader()
    let fieldName = this.props.party.constructor.name.toLowerCase()
    let validateRequest = {}
    validateRequest['action'] = 'UpdateAllowedFields'
    validateRequest[fieldName] = party

    try {
      const reasonsInvalid = (await this.PartyValidator.Validate(validateRequest)).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        this.reasonsInvalid = reasonsInvalid
        HideGlobalLoader()
        return
      }
    } catch (e) {
      console.error('Error Validating party', e)
      NotificationFailure('Error Validating party')
      HideGlobalLoader()
      return
    }

    let updateAllowedFieldsRequest = {}
    updateAllowedFieldsRequest[fieldName] = party

    try {
      // perform update
      const response = await this.PartyAdministrator.UpdateAllowedFields(updateAllowedFieldsRequest)
      // update party in redux state
      SetMyParty(response[fieldName])
      this.setState({
        party: response[fieldName],
        activeState: events.saveChanges,
      })
    } catch (e) {
      console.error('error updating allowed fields', e)
      HideGlobalLoader()
      NotificationFailure('Error Updating General')
      return
    }

    NotificationSuccess('Successfully Updated General')
    HideGlobalLoader()
  }

  handleCancel() {
    const {partyCopy} = this.state
    this.reasonsInvalid.clearAll()
    this.setState({
      party: new this.party(partyCopy),
      activeState: events.cancelEditing,
    })
  }

  renderControlIcons() {
    const {activeState} = this.state
    const {classes} = this.props
    switch (activeState) {
      case states.editing:
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
              onClick={this.handleCancel}
            >
              <Tooltip title='Cancel'>
                <CancelIcon className={classes.buttonIcon}/>
              </Tooltip>
            </Fab>
          </React.Fragment>
        )

      case states.nop:
        return (
          <React.Fragment>
            <Fab
              color={'primary'}
              className={classes.button}
              size={'small'}
              onClick={this.handleStartEditing}
            >
              <Tooltip title='Edit'>
                <EditIcon/>
              </Tooltip>
            </Fab>
          </React.Fragment>
        )
      default:
        return null
    }
  }

  handleFieldChange(e) {
    let {party} = this.state
    party[e.target.id] = e.target.value
    this.reasonsInvalid.clearField(e.target.id)
    this.setState({party})
    this.setState({party})
  }

  render() {
    const {classes} = this.props
    const {activeState} = this.state
    const fieldValidations = this.reasonsInvalid.toMap()
    const editingState = activeState === states.editing

    let party = this.state.party || {}

    //TODO add party specific rendering of details
    return (
      <Grid container direction='column' spacing={8} alignItems='center'>
        <Grid item>
          <Card className={classes.detailCard}>
            <CardHeader title={
              <Grid container
                    direction='row'
                    justify='flex-end'
              >
                <Grid item>
                  {this.renderControlIcons()}
                </Grid>
              </Grid>
            }/>
            <CardContent>
              <Grid container direction='column' spacing={8}
                    alignItems={'center'}>
                <Grid item>
                  <TextField
                    className={classes.formField}
                    id='name'
                    label='Name'
                    value={party.name}
                    InputProps={{
                      disableUnderline: !editingState,
                      readOnly: !editingState,
                    }}
                    onChange={this.handleFieldChange}
                    helperText={
                      fieldValidations.name ?
                        fieldValidations.name.help :
                        undefined
                    }
                    error={!!fieldValidations.name}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.formField}
                    id='emailAddress'
                    label='EmailAddress'
                    value={party.adminEmailAddress}
                    InputProps={{
                      disableUnderline: true,
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/*<Grid item>*/}
                  {/*<div>{JSON.stringify(party)}</div>*/}
                {/*</Grid>*/}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

General = withStyles(styles)(General)

General.propTypes = {
  /**
   * Logged in party from redux
   */
  party: PropTypes.object.isRequired,
  /**
   * Success Action Creator
   */
  NotificationSuccess: PropTypes.func.isRequired,
  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,
  /**
   * Show Global Loader Action Creator
   */
  ShowGlobalLoader: PropTypes.func.isRequired,
  /**
   * Hide Global Loader Action Creator
   */
  HideGlobalLoader: PropTypes.func.isRequired,
  /**
   * SetMyparty action creator
   */
  SetMyParty: PropTypes.func.isRequired,
}
General.defaultProps = {}

export default General