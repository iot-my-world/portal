import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  withStyles,
  AppBar,
  Toolbar,
  Hidden,
  Button,
} from '@material-ui/core'
import Menu from "@material-ui/icons/Menu"
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";

import headerStyle
  from 'assets/jss/material-dashboard-pro-react/components/headerStyle.jsx'

const styles = theme => ({})

const Header = props => {
  const {classes, handleDrawerToggle} = props

  const appBarClasses = classNames({
    [' ' + classes['primary']]: 'primary',
  })

  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
          <div className={classes.sidebarMinimize}>
            {props.miniActive ? (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Hidden>
        <div className={classes.flex}>
          <Button>
            aweh
          </Button>
        </div>
        <Hidden smDown implementation="css">
          Header links
        </Hidden>
        <Hidden mdUp>
          <Button
            onClick={handleDrawerToggle}
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
  handleDrawerToggle: PropTypes.func.isRequired,
  sidebarMinimize: PropTypes.func.isRequired,
}
Header.defaultProps = {}

const StyledHeader = withStyles(headerStyle)(Header)

export default StyledHeader