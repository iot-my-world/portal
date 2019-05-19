import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import {
  withStyles, Fab, AppBar,
  Toolbar, Hidden,
} from '@material-ui/core'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth'
import {
  Menu, MoreVert, ViewList,
} from "@material-ui/icons"

import headerStyle from "./style"
import logo from 'assets/images/logo.png'

function Header({ ...props }) {
  function getViewName() {
    for (let route of props.routes) {
      if (route.collapse) {
        for (let view of route.views) {
          if (view.path === props.location.pathname) {
            return view.name
          }
        }
      } else if (route.path === props.location.pathname) {
        return route.name
      }
    }
    return null
  }
  const { classes, width } = props

  if (isWidthUp('md', width)) {
    return (
      <AppBar
        className={classNames(classes.appBar, classes.primary)}
        style={{padding: 0}}
      >
        <Toolbar className={classes.toolbarDesktop}>
          <div className={classes.sidebarMinimize}>
            <Fab
              size={'small'}
              onClick={props.sidebarMinimize}
            >
              {props.miniActive
                ? <ViewList className={classes.sidebarMiniIcon}/>
                : <MoreVert className={classes.sidebarMiniIcon}/>
              }
            </Fab>
          </div>
          <div className={classes.desktopViewName}>
            {getViewName()}
          </div>
        </Toolbar>
      </AppBar>
    )
  } else {
    return (
      <AppBar
        className={classNames(classes.appBar, classes.primary)}
        style={{padding: 0}}
      >
        <Toolbar className={classes.toolbarMini}>
          <div className={classes.logoWrapper}>
            <img src={logo} alt='logo' className={classes.logo}/>
          </div>
          <div className={classes.flex}>
            {getViewName()}
          </div>
          <Fab
            size={'small'}
            onClick={props.handleDrawerToggle}
          >
            <Menu/>
          </Fab>
        </Toolbar>
      </AppBar>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
}

Header.defaultProps = {

}

export default withWidth()(withStyles(headerStyle)(Header))
