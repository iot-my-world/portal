import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Dialog as MUIDialog, DialogContent,
  DialogTitle, Fab, Tooltip,
} from '@material-ui/core'
import {
  MdClose as CloseIcon,
} from 'react-icons/md'
import classNames from 'classnames'
import logo from 'assets/images/logo/logo_emblem.png'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth'

const styles = theme => ({
  dialogRootOverride: {
    backgroundColor: theme.palette.grey[100],
  },
  dialogTitleRoot: {
    padding: '0 0 0 0',
    backgroundColor: theme.palette.primary.main,
    height: '46px',
  },
  dialogTitle: {
    padding: '2px 5px 2px 5px',
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
    width: '25px',
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
    minHeight: '25px',
    minWidth: '25px',
    height: '25px',
    width: '25px',
    backgroundColor: theme.palette.primary.dark,
  },
  dialogTitleCloseIcon: {
    fontSize: '15px',
    color: theme.palette.primary.contrastText,
  },
  contentRoot: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    overflow: 'hidden',
    padding: 5,
  },
  contentRootFullScreen: {
    height: 'calc(100vh - 56px)',
    overflow: 'hidden',
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
      fullScreen,
      ...rest
    } = this.props

    if (!open) {
      return null
    }

    let fullScreenActive = (!isWidthUp('md', width))
    if (fullScreen !== undefined) {
      fullScreenActive = fullScreen
    }

    return (
      <MUIDialog
        open={open}
        fullScreen={fullScreenActive}
        PaperProps={{classes: {root: classes.dialogRootOverride}}}
        {...rest}
      >
        <DialogTitle classes={{root: classes.dialogTitleRoot}}>
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
                <Tooltip title='Close' placement='top'>
                  <Fab
                    color='primary'
                    aria-label='Close'
                    className={classes.dialogTitleCloseButton}
                    onClick={closeDialog}
                  >
                    <CloseIcon className={classes.dialogTitleCloseIcon}/>
                  </Fab>
                </Tooltip>
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent
          classes={{
            root: classNames(
              classes.contentRoot,
              {[classes.contentRootFullScreen]: fullScreenActive},
            ),
          }}
        >
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