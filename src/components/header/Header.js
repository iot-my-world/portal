import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import {
  withStyles, Fab, AppBar,
  Toolbar, Hidden,
} from '@material-ui/core'
import {
  Menu, MoreVert, ViewList,
} from "@material-ui/icons"

import headerStyle from "./style"

function Header({ ...props }) {
  function makeBrand() {
    var name
    props.routes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === props.location.pathname) {
            name = prop.name
          }
          return null
        })
      }
      if (prop.path === props.location.pathname) {
        name = prop.name
      }
      return null
    })
    return name
  }
  const { classes, color} = props
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  })

  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={classes.sidebarMinimize}>
            <Fab
              size={'medium'}
              onClick={props.sidebarMinimize}
            >
              {props.miniActive
                ? <ViewList className={classes.sidebarMiniIcon}/>
                : <MoreVert className={classes.sidebarMiniIcon}/>
              }
            </Fab>
          </div>
        </Hidden>
        <div className={classes.flex}>
          {makeBrand()}
        </div>
        <Hidden mdUp>
          <Fab
            size={'medium'}
            onClick={props.handleDrawerToggle}
          >
            <Menu/>
          </Fab>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool
}

Header.defaultProps = {
  color: 'primary'
}

export default withStyles(headerStyle)(Header)
