import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Route, Switch} from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles, Drawer, AppBar, Toolbar, List,
  Typography, Divider, IconButton, ListItemIcon,
  ListItemText, ListItem, Hidden, Collapse,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AppRoutes, {HomeRoute} from './Routes'

const drawerWidth = 200

const styles = theme => ({
  route: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
})

const Routes = AppRoutes.map((routeSection, routeSectionIdx) => {
  let routes = []
  routeSection.forEach(
      (routeGroupOrRoute, routeGroupOrRouteIdx) => {
        if (routeGroupOrRoute.group) {
          let embeddedRoutes = []
          routeGroupOrRoute.routes.forEach(
              (route, routeIdx) => {
                if (route.component !== undefined) {
                  embeddedRoutes.push(<Route
                      key={`${routeSectionIdx}${routeGroupOrRouteIdx}${routeIdx}`}
                      exact
                      path={route.path}
                      render={props => <route.component {...props}/>}
                  />)
                }
              })
          routes = [...routes, ...embeddedRoutes]
        } else {
          if (routeGroupOrRoute.component !== undefined) {
            routes.push(<Route
                key={`${routeSectionIdx}${routeGroupOrRouteIdx}`}
                exact
                path={routeGroupOrRoute.path}
                render={() => <div>{routeGroupOrRoute.path}</div>}
            />)
          }
        }
      })
  return routes
})

class App extends Component {
  constructor(props) {
    super(props)
    this.renderMobileDrawerAndToolbar =
        this.renderMobileDrawerAndToolbar.bind(this)
    this.renderDesktopDrawerAndToolbar =
        this.renderDesktopDrawerAndToolbar.bind(this)
    this.renderDrawerMenus = this.renderDrawerMenus.bind(this)
    this.toggleMobileDrawer = this.toggleMobileDrawer.bind(this)
    this.toggleDesktopDrawer = this.toggleDesktopDrawer.bind(this)
    this.toggleMenuState = this.toggleMenuState.bind(this)
    this.changePath = this.changePath.bind(this)

    let menuState = {}
    AppRoutes.forEach((routeSection, routeSectionIdx) => {
      if (!menuState.hasOwnProperty(`${routeSectionIdx}`)) {
        menuState[`${routeSectionIdx}`] = {}
      }
      routeSection.forEach((routeGroupOrRoute, routeGroupOrRouteIdx) => {
        if (routeGroupOrRoute.group) {
          menuState[`${routeSectionIdx}`][`${routeGroupOrRouteIdx}`] = false
        }
      })
    })

    this.state = {
      open: true,
      mobileDrawerOpen: false,
      desktopDrawerOpen: true,
      menuState,
      route: HomeRoute,
    }
  }

  toggleDesktopDrawer() {
    this.setState({desktopDrawerOpen: !this.state.desktopDrawerOpen})
  }

  toggleMobileDrawer() {
    this.setState({mobileDrawerOpen: !this.state.mobileDrawerOpen})
  }

  toggleMenuState(routeSectionIdx, routeGroupOrRouteIdx) {
    let {
      menuState,
    } = this.state
    menuState[`${routeSectionIdx}`][`${routeGroupOrRouteIdx}`] =
        !menuState[`${routeSectionIdx}`][`${routeGroupOrRouteIdx}`]
    this.setState(menuState)
  }

  changePath(route, usedMobileDrawer) {
    const {
      history,
    } = this.props
    history.push(route.path)
    if (usedMobileDrawer) {
      this.setState({
        mobileDrawerOpen: false,
        route,
      })
    } else {
      this.setState({route})
    }
  }

  render() {
    const {classes} = this.props

    return (
        <div className={classes.route}>
          <Hidden smDown>
            {this.renderDesktopDrawerAndToolbar()}
          </Hidden>
          <Hidden mdUp>
            {this.renderMobileDrawerAndToolbar()}
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar}/>
            <div>
              <Switch>
                {Routes}
              </Switch>
            </div>
          </main>
        </div>
    )
  }

  renderDesktopDrawerAndToolbar() {
    const {classes, theme} = this.props
    const {
      desktopDrawerOpen,
      route,
    } = this.state

    return <React.Fragment>
      <AppBar
          position='fixed'
          className={classNames(classes.appBar, {
            [classes.appBarShift]: desktopDrawerOpen,
          })}
      >
        <Toolbar disableGutters={!desktopDrawerOpen}>
          <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.toggleDesktopDrawer}
              className={classNames(classes.menuButton, {
                [classes.hide]: desktopDrawerOpen,
              })}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant='h6' color='inherit' noWrap>
            {route.text}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
          variant='permanent'
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: desktopDrawerOpen,
            [classes.drawerClose]: !desktopDrawerOpen,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: desktopDrawerOpen,
              [classes.drawerClose]: !desktopDrawerOpen,
            }),
          }}
          open={desktopDrawerOpen}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.toggleDesktopDrawer}>
            {theme.direction === 'rtl' ?
                <ChevronRightIcon/> :
                <ChevronLeftIcon/>}
          </IconButton>
        </div>
        <Divider/>
        {this.renderDrawerMenus()}
      </Drawer>
    </React.Fragment>
  }

  renderMobileDrawerAndToolbar() {
    const {classes, theme} = this.props
    const {
      mobileDrawerOpen,
      route,
    } = this.state

    return <React.Fragment>
      <AppBar
          position='fixed'
          className={classNames(classes.appBar, {
            [classes.appBarShift]: mobileDrawerOpen,
          })}
      >
        <Toolbar disableGutters={!mobileDrawerOpen}>
          <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.toggleMobileDrawer}
              className={classNames(classes.menuButton, {
                [classes.hide]: mobileDrawerOpen,
              })}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant='h6' color='inherit' noWrap>
            {route.text}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
          variant='temporary'
          // keep mounted for better open performance on mobile
          ModalProps={{keepMounted: true}}
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: mobileDrawerOpen,
            [classes.drawerClose]: !mobileDrawerOpen,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: mobileDrawerOpen,
              [classes.drawerClose]: !mobileDrawerOpen,
            }),
          }}
          open={mobileDrawerOpen}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.toggleMobileDrawer}>
            {theme.direction === 'rtl' ?
                <ChevronRightIcon/> :
                <ChevronLeftIcon/>}
          </IconButton>
        </div>
        <Divider/>
        {this.renderDrawerMenus(true)}
      </Drawer>
    </React.Fragment>
  }

  renderDrawerMenus(usedMobileDrawer) {
    const {
      classes,
    } = this.props

    const {menuState} = this.state
    return <React.Fragment>
      {AppRoutes.map((routeSection, routeSectionIdx) => {
        return <React.Fragment key={`${routeSectionIdx}`}>
          <List>
            {routeSection.map((routeGroupOrRoute, routeGroupOrRouteIdx) => {
              if (routeGroupOrRoute.group) {
                return <React.Fragment
                    key={`${routeSectionIdx}${routeGroupOrRouteIdx}`}>
                  <ListItem button onClick={() => this.toggleMenuState(
                      routeSectionIdx, routeGroupOrRouteIdx)}>
                    <ListItemIcon>
                      {routeGroupOrRoute.icon}
                    </ListItemIcon>
                    <ListItemText inset primary={routeGroupOrRoute.text}/>
                    {menuState[`${routeSectionIdx}`][`${routeGroupOrRouteIdx}`] ?
                        <ExpandLess/> :
                        <ExpandMore/>}
                  </ListItem>
                  <Collapse
                      in={menuState[`${routeSectionIdx}`][`${routeGroupOrRouteIdx}`]}
                      timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {routeGroupOrRoute.routes.map((route, routeIdx) => {
                        return <ListItem
                            button
                            className={classes.nested}
                            key={`${routeSectionIdx}${routeGroupOrRouteIdx}${routeIdx}`}
                            onClick={() => this.changePath(route, usedMobileDrawer)}
                        >
                          <ListItemIcon>
                            {route.icon}
                          </ListItemIcon>
                          <ListItemText inset primary={route.text}/>
                        </ListItem>
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              } else {
                return <ListItem
                    button
                    key={`${routeSectionIdx}${routeGroupOrRouteIdx}`}
                    onClick={() => this.changePath(routeGroupOrRoute.path, usedMobileDrawer)}
                >
                  <ListItemIcon>
                    {routeGroupOrRoute.icon}
                  </ListItemIcon>
                  <ListItemText primary={routeGroupOrRoute.text}/>
                </ListItem>
              }
            })}
          </List>
          <Divider/>
        </React.Fragment>
      })}
    </React.Fragment>
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  /**
   * react-router function
   */
  history: PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(App)