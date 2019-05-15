import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import {
  withStyles, Button, AppBar,
  Toolbar, Hidden,
} from '@material-ui/core'
// material-ui icons
import Menu from "@material-ui/icons/Menu"
import MoreVert from "@material-ui/icons/MoreVert"
import ViewList from "@material-ui/icons/ViewList"

import headerStyle from "assets/jss/material-dashboard-pro-react/components/headerStyle.jsx"

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
  const { classes, color, rtlActive } = props
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  })
  const sidebarMinimize =
    classes.sidebarMinimize +
    " " +
    classNames({
      [classes.sidebarMinimizeRTL]: rtlActive
    })
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <Button
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                onClick={props.sidebarMinimize}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          {makeBrand()}
        </div>
        <Hidden mdUp>
          <Button
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
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

export default withStyles(headerStyle)(Header)
