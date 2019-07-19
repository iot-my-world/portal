import React, {useReducer, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import PropTypes from 'prop-types'
import {
  Fab,
  makeStyles,
  TextField,
  Tooltip,
} from '@material-ui/core'
import Dialog from 'components/Dialog'
import {Backend} from 'brain/sigfox/backend'
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
  BackendAdministrator,
  BackendValidator,
} from 'brain/sigfox/backend'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import {IdIdentifier} from 'brain/search/identifier/index'

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

function initialiseState(initialState, backend) {
  return {
    activeState: initialState,
    selectedBackend: new Backend(backend),
    backendCopy: new Backend(),
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case actionTypes.startEditExisting:
      return {
        ...state,
        activeState: states.editing,
        backendCopy: new Backend(state.selectedBackend),
      }

    case actionTypes.cancelEditExisting:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedBackend: new Backend(state.backendCopy),
        backendCopy: new Backend(),
      }

    case actionTypes.fieldChange:
      state.selectedBackend[action.field] = action.value
      return {
        ...state,
        selectedBackend: state.selectedBackend,
      }

    case actionTypes.createNewSuccess:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedBackend: action.backend,
        backendCopy: new Backend(),
      }

    case actionTypes.updateSuccess:
      return {
        ...state,
        activeState: states.viewingExisting,
        selectedBackend: action.backend,
        backendCopy: new Backend(),
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
    backend,
    onCreateSuccess,
    onUpdateSuccess,
  } = props
  const dispatch = useDispatch()
  const claims = useSelector(state => state.auth.claims)
  const classes = useStyles()
  const [reasonsInvalid, setReasonsInvalid] = useState(new ReasonsInvalid())
  const [state, actionDispatcher] = useReducer(
    stateReducer,
    initialiseState(initialState, backend),
  )
  const fieldValidations = reasonsInvalid.toMap()

  const handleSaveNew = async () => {
    dispatch(ShowGlobalLoader())

    // perform validation
    try {
      state.selectedBackend.ownerId = new IdIdentifier(claims.partyId)
      state.selectedBackend.ownerPartyType = claims.partyType
      const reasonsInvalid = (await BackendValidator.Validate({
        backend: state.selectedBackend,
        action: 'Create',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        setReasonsInvalid(reasonsInvalid)
        dispatch(HideGlobalLoader())
        return
      }
    } catch (e) {
      console.error('Error Validating Backend', e)
      dispatch(NotificationFailure('Error Validating Backend'))
      dispatch(HideGlobalLoader())
      return
    }

    // perform creation
    try {
      const createResponse = await BackendAdministrator.Create({
        backend: state.selectedBackend,
      })
      actionDispatcher({
        type: actionTypes.createNewSuccess,
        backend: createResponse.backend,
      })
      dispatch(NotificationSuccess('Successfully Created Backend'))
      onCreateSuccess(createResponse.backend)
    } catch (e) {
      console.error('Error Creating Backend', e)
      dispatch(NotificationFailure('Error Creating Backend'))
      dispatch(HideGlobalLoader())
      return
    }

    dispatch(HideGlobalLoader())
  }

  const handleSaveChanges = async () => {
    dispatch(ShowGlobalLoader())

    // perform validation
    try {
      const reasonsInvalid = (await BackendValidator.Validate({
        backend: state.selectedBackend,
        action: 'UpdateAllowedFields',
      })).reasonsInvalid
      if (reasonsInvalid.count > 0) {
        setReasonsInvalid(reasonsInvalid)
        dispatch(HideGlobalLoader())
        return
      }
    } catch (e) {
      console.error('Error Validating Backend', e)
      dispatch(NotificationFailure('Error Validating Backend'))
      dispatch(HideGlobalLoader())
      return
    }

    // perform update
    try {
      const updateResponse = await BackendAdministrator.UpdateAllowedFields({
        backend: state.selectedBackend,
      })
      actionDispatcher({
        type: actionTypes.u,
        backend: updateResponse.backend,
      })
      dispatch(NotificationSuccess('Successfully Updated Backend'))
      onUpdateSuccess(updateResponse.backend)
    } catch (e) {
      console.error('Error Updating Backend', e)
      dispatch(NotificationFailure('Error Updating backend'))
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
      title={'Backend'}
      additionalTitleControls={additionalTitleControls}
      fullScreen={false}
    >
      <div className={classes.root}>
        <TextField
          className={classes.formField}
          id='name'
          label='Name'
          value={state.selectedBackend.name}
          onChange={handleFieldChange}
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
   * Backend being viewed, created or edited
   */
  backend: PropTypes.instanceOf(Backend),
  /**
   * Initial state with which the detail dialog should open
   */
  initialState: PropTypes.oneOf(Object.values(states)),
  /**
   * Function will will be called on create success with newly created
   * backend
   */
  onCreateSuccess: PropTypes.func,
  /**
   * Function will will be called on update success with updated
   * backend
   */
  onUpdateSuccess: PropTypes.func,
}

DetailDialog.defaultProps = {
  initialState: states.viewingExisting,
  backend: new Backend(),
  onCreateSuccess: () => {
  },
  onUpdateSuccess: () => {
  },
}

export default DetailDialog

export {
  states,
}