import React from 'react'
import PropTypes from 'prop-types'
import {ScaleLoader} from 'react-spinners'
import {Dialog, withStyles} from '@material-ui/core'


const styles = theme => ({
  progressSpinnerDialog: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  progressSpinnerDialogBackdrop: {
    backgroundColor: 'transparent',
  },
})

let FullPage = props => {
  const {
    open,
    classes,
  } = props

  return <Dialog
      id={'fullPageLoader'}
      open={open}
      BackdropProps={{classes: {root: classes.progressSpinnerDialogBackdrop}}}
      PaperProps={{classes: {root: classes.progressSpinnerDialog}}}
      className={classes.progressSpinnerDialog}
  >
    <ScaleLoader isLoading/>
  </Dialog>
}

FullPage.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
}

FullPage.defaultProps = {
  open: false,
}

export default withStyles(styles)(FullPage)

