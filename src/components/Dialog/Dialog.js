import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Dialog as MUIDialog, DialogContent,
  DialogTitle, Fab, Tooltip,
} from '@material-ui/core'
import {
  MdClose as CloseIcon,
} from 'react-icons/md'
import logo from 'assets/images/logo.png'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth'

const styles = theme => ({
  dialogRootOverride: {
    backgroundColor: theme.palette.grey[100],
  },
  dialogTitleWrapper: {
    padding: 5,
    backgroundColor: theme.palette.primary.main,
  },
  dialogTitle: {
    padding: 5,
    display: 'flex',
    justifyContent: 'space-between',
  },
  dialogTitleHeading: {
    display: 'grid',
    gridTemplateRows: 'auto',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  logoWrapper: {
    padding: 4,
  },
  logo: {
    width: '40px',
    verticalAlign: 'middle',
    border: '0',
  },
  dialogTitleText: {
    justifySelf: 'center',
    marginLeft: 10,
    color: theme.palette.primary.contrastText,
  },
  dialogTitleControlsWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  dialogTitleControlWrapper: {
    paddingLeft: 4,
  },
  dialogTitleCloseButton: {
    padding: 2,
    minHeight: '20px',
    minWidth: '20px',
    height: '20px',
    width: '20px',
  },
  dialogTitleCloseIcon: {
    fontSize: '15px',
  },
  contentRoot: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    overflow: 'hidden',
    padding: 10,
  },
})

class Dialog extends Component {
  render() {
    const {
      width,
      open,
      classes,
      closeDialog,
      children,
      title,
      additionalTitleControls,
      ...rest
    } = this.props

    if (!open) {
      return null
    }

    return (
      <MUIDialog
        open={open}
        fullScreen={!isWidthUp('md', width)}
        PaperProps={{classes: {root: classes.dialogRootOverride}}}
        {...rest}
      >
        <DialogTitle className={classes.dialogTitleWrapper}>
          <div className={classes.dialogTitle}>
            <div className={classes.dialogTitleHeading}>
              <div className={classes.logoWrapper}>
                <img src={logo} alt='logo' className={classes.logo}/>
              </div>
              <div className={classes.dialogTitleText}>
                {title}
              </div>
            </div>
            <div className={classes.dialogTitleControlsWrapper}>
              {additionalTitleControls.map((ctrl, idx) => {
                return (
                  <div
                    className={classes.dialogTitleControlWrapper}
                    key={idx}
                  >
                    {ctrl}
                  </div>
                )
              })}
              <div className={classes.dialogTitleControlWrapper}>
                <Fab
                  color='primary'
                  aria-label='Close'
                  className={classes.dialogTitleCloseButton}
                  onClick={closeDialog}
                >
                  <Tooltip title='Close' placement='top'>
                    <CloseIcon className={classes.dialogTitleCloseIcon}/>
                  </Tooltip>
                </Fab>
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent classes={{root: classes.contentRoot}}>
          {children}
        </DialogContent>
      </MUIDialog>
    )
  }
}

Dialog.propTypes = {
  /**
   * boolean indicating if the detail dialog should be open
   */
  open: PropTypes.bool.isRequired,
  /**
   * function which can be called to close the detail dialog
   */
  closeDialog: PropTypes.func.isRequired,
  /**
   * dialog content
   */
  children: PropTypes.any.isRequired,
  /**
   * dialog title
   */
  title: PropTypes.string,
  /**
   * additional title controls
   */
  additionalTitleControls: PropTypes.array,
}

Dialog.defaultProps = {
  open: false,
  children: null,
  title: '',
  additionalTitleControls: [],
}

Dialog = withWidth()(withStyles(styles)(Dialog))

export default Dialog