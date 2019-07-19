import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core'
import Dialog from 'components/Dialog'

const useStyles = makeStyles(theme => ({

}))

function DetailDialog(props){
  const {
    open,
    closeDialog,
  } = props

  return (
    <Dialog
      open={open}
      closeDialog={closeDialog}
      title={'Backend'}
      // additionalTitleControls={this.renderControlIcons()}
      fullScreen={false}
    >
      detail dialog
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
}

DetailDialog.defaultProps = {

}

export default DetailDialog