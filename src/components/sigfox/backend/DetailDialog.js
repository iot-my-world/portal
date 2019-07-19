import React, {useReducer} from 'react'
import PropTypes from 'prop-types'
import {
  Fab,
  makeStyles,
  TextField,
  Tooltip,
} from '@material-ui/core'
import Dialog from 'components/Dialog'
import {Backend} from 'brain/sigfox/backend'
import {CancelIcon, EditIcon, SaveIcon} from 'components/icon/index'

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

    default:
      return state
  }
}

const fieldChange = actionDispatcher => e => {
  actionDispatcher({
    type: actionTypes.fieldChange,
    field: e.target.name
      ? e.target.name
      : e.target.id,
    value: e.target.value,
  })
}

function DetailDialog(props) {
  const {
    open,
    closeDialog,
    initialState,
    backend,
  } = props
  const classes = useStyles()
  const [state, actionDispatcher] = useReducer(
    stateReducer,
    initialiseState(initialState, backend),
  )

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
            // onClick={this.handleSaveChanges}
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
            // onClick={this.handleSaveNew}
          >
            <SaveIcon className={classes.buttonIcon}/>
          </Fab>
        </Tooltip>,
        ...additionalTitleControls,
      ]
      break
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
          onChange={fieldChange(actionDispatcher)}
          InputProps={{
            disableUnderline: stateIsViewing,
            readOnly: stateIsViewing,
          }}
          // helperText={
          //   fieldValidations.name
          //     ? fieldValidations.name.help
          //     : undefined
          // }
          // error={!!fieldValidations.name}
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
}

DetailDialog.defaultProps = {
  initialState: states.viewingExisting,
  backend: new Backend(),
}

export default DetailDialog

export {
  states,
}