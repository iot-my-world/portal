import React, {useReducer, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import PropTypes from 'prop-types'
import {
  Fab, FormControl, FormHelperText, InputLabel,
  makeStyles, MenuItem, Select,
  TextField,
  Tooltip,
} from '@material-ui/core'
import Dialog from 'components/Dialog'
import {Sigbug} from 'brain/device/sigbug'
import {CancelIcon, EditIcon, SaveIcon} from 'components/icon'
import {
  NotificationFailure,
  NotificationSuccess,
} from 'actions/notification'
import {
  HideGlobalLoader,
  ShowGlobalLoader,
} from 'actions/app'

import {
  SigbugAdministrator,
  SigbugValidator,
} from 'brain/device/sigbug'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import {IdIdentifier} from 'brain/search/identifier/index'
import {allPartyTypes, SystemPartyType} from 'brain/party/types'

const useStyles = makeStyles(theme => ({
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
}))

const states = {
  viewingExisting: 0,
  creating: 1,
  editing: 2,
}

const actionTypes = {
  startEditExisting: 0,
  cancelEditExisting: 1,
  fieldChange: 2,
  createNewSuccess: 3,
  updateSuccess: 4,
}

function initialiseState(initialState, sigbug) {
  return {
    activeState: initialState,
    selectedSigbug: new Sigbug(sigbug),
    sigbugCopy: new Sigbug(),
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case actionTypes.startEditExisting:
      return {
        ...state,
        activeState: states.editing,
        sigbugCopy: new Sigbug(state.selectedSigbug),
      }

    case actionTypes.cancelEditExisting:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedSigbug: new Sigbug(state.sigbugCopy),
        sigbugCopy: new Sigbug(),
      }

    case actionTypes.fieldChange:
      state.selectedSigbug[action.field] = action.value
      return {
        ...state,
        selectedSigbug: state.selectedSigbug,
      }

    case actionTypes.createNewSuccess:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedSigbug: action.sigbug,
        sigbugCopy: new Sigbug(),
      }

    case actionTypes.updateSuccess:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedSigbug: action.sigbug,
        sigbugCopy: new Sigbug(),
      }

    default:
      return state
  }
}

function DetailDialog(props) {
  const {
    open,
    closeDialog,
    initialState,
    sigbug,
    onCreateSuccess,
    onUpdateSuccess,
  } = props
  const dispatch = useDispatch()
  const claims = useSelector(state => state.auth.claims)
  const classes = useStyles()
  const [reasonsInvalid, setReasonsInvalid] = useState(new ReasonsInvalid())
  const [state, actionDispatcher] = useReducer(
    stateReducer,
    initialiseState(initialState, sigbug),
  )
  const fieldValidations = reasonsInvalid.toMap()

  const handleSaveNew = async () => {
    dispatch(ShowGlobalLoader())

    // perform validation
    try {
      if (claims.partyType !== SystemPartyType) {
        // users other than system do not have the option of
        // selecting an owner, it is automatically set to them
        state.selectedSigbug.ownerId = new IdIdentifier(claims.partyId)
        state.selectedSigbug.ownerPartyType = claims.partyType
      }
      const reasonsInvalid = (await SigbugValidator.Validate({
        sigbug: state.selectedSigbug,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        setReasonsInvalid(reasonsInvalid)
        dispatch(HideGlobalLoader())
        return
      }
    } catch (e) {
      console.error('Error Validating Sigbug', e)
      dispatch(NotificationFailure('Error Validating Sigbug'))
      dispatch(HideGlobalLoader())
      return
    }

    // perform creation
    try {
      const createResponse = await SigbugAdministrator.Create({
        sigbug: state.selectedSigbug,
      })
      actionDispatcher({
        type: actionTypes.createNewSuccess,
        sigbug: createResponse.sigbug,
      })
      dispatch(NotificationSuccess('Successfully Created Sigbug'))
      onCreateSuccess(createResponse.sigbug)
    } catch (e) {
      console.error('Error Creating Sigbug', e)
      dispatch(NotificationFailure('Error Creating Sigbug'))
      dispatch(HideGlobalLoader())
      return
    }

    dispatch(HideGlobalLoader())
  }

  const handleSaveChanges = async () => {
    dispatch(ShowGlobalLoader())

    // perform validation
    try {
      const reasonsInvalid = (await SigbugValidator.Validate({
        sigbug: state.selectedSigbug,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        setReasonsInvalid(reasonsInvalid)
        dispatch(HideGlobalLoader())
        return
      }
    } catch (e) {
      console.error('Error Validating Sigbug', e)
      dispatch(NotificationFailure('Error Validating Sigbug'))
      dispatch(HideGlobalLoader())
      return
    }

    // perform update
    try {
      const updateResponse = await SigbugAdministrator.UpdateAllowedFields({
        sigbug: state.selectedSigbug,
      })
      actionDispatcher({
        type: actionTypes.u,
        sigbug: updateResponse.sigbug,
      })
      dispatch(NotificationSuccess('Successfully Updated Sigbug'))
      onUpdateSuccess(updateResponse.sigbug)
    } catch (e) {
      console.error('Error Updating Sigbug', e)
      dispatch(NotificationFailure('Error Updating sigbug'))
      dispatch(HideGlobalLoader())
      return
    }

    dispatch(HideGlobalLoader())
  }

  const handleFieldChange = e => {
    const field = e.target.name
      ? e.target.name
      : e.target.id
    reasonsInvalid.clearField(field)
    actionDispatcher({
      type: actionTypes.fieldChange,
      field,
      value: e.target.value,
    })
  }

  let additionalTitleControls = []
  switch (state.activeState) {
    case states.viewingExisting:
      additionalTitleControls = [
        <Tooltip
          title='Edit'
          placement={'top'}
        >
          <Fab
            size={'small'}
            onClick={() => actionDispatcher({
              type: actionTypes.startEditExisting,
            })}
          >
            <EditIcon className={classes.buttonIcon}/>
          </Fab>
        </Tooltip>,
        ...additionalTitleControls,
      ]
      break

    case states.editing:
      additionalTitleControls = [
        <Tooltip
          title='Save Changes'
          placement={'top'}
        >
          <Fab
            size={'small'}
            onClick={handleSaveChanges}
          >
            <SaveIcon className={classes.buttonIcon}/>
          </Fab>
        </Tooltip>,
        <Tooltip
          title='Cancel'
          placement={'top'}
        >
          <Fab
            size={'small'}
            onClick={() => actionDispatcher({
              type: actionTypes.cancelEditExisting,
            })}
          >
            <CancelIcon className={classes.buttonIcon}/>
          </Fab>
        </Tooltip>,
        ...additionalTitleControls,
      ]
      break

    case states.creating:
      additionalTitleControls = [
        <Tooltip
          title='Save New'
          placement={'top'}
        >
          <Fab
            size={'small'}
            onClick={handleSaveNew}
          >
            <SaveIcon className={classes.buttonIcon}/>
          </Fab>
        </Tooltip>,
        ...additionalTitleControls,
      ]
      break

    default:
  }

  const stateIsViewing = state.activeState === states.viewingExisting

  return (
    <Dialog
      open={open}
      closeDialog={closeDialog}
      title={'Sigbug'}
      additionalTitleControls={additionalTitleControls}
      fullScreen={false}
    >
      <div className={classes.root}>
        <TextField
          className={classes.formField}
          id='deviceId'
          label='Device ID'
          value={state.selectedSigbug.deviceId}
          onChange={handleFieldChange}
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
        {(claims.partyType === SystemPartyType) &&
          <React.Fragment>
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
                value={state.selectedSigbug.ownerPartyType}
                onChange={handleFieldChange}
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
          </React.Fragment>
        }
      </div>
    </Dialog>
  )
}

DetailDialog.propTypes = {
  /**
   * Determines if the dialog is open
   */
  open: PropTypes.bool.isRequired,
  /**
   * Function which can be called to close dialog
   * (i.e. set open to false)
   */
  closeDialog: PropTypes.func.isRequired,
  /**
   * Sigbug being viewed, created or edited
   */
  sigbug: PropTypes.instanceOf(Sigbug),
  /**
   * Initial state with which the detail dialog should open
   */
  initialState: PropTypes.oneOf(Object.values(states)),
  /**
   * Function will will be called on create success with newly created
   * sigbug
   */
  onCreateSuccess: PropTypes.func,
  /**
   * Function will will be called on update success with updated
   * sigbug
   */
  onUpdateSuccess: PropTypes.func,
}

DetailDialog.defaultProps = {
  initialState: states.viewingExisting,
  sigbug: new Sigbug(),
  onCreateSuccess: () => {
  },
  onUpdateSuccess: () => {
  },
}

export default DetailDialog

export {
  states,
}