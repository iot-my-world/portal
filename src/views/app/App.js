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
import LockIcon from '@material-ui/icons/Lock'
import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import DomainIcon from '@material-ui/icons/Domain'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import HomeIcon from '@material-ui/icons/Home'

const drawerWidth = 200

const styles = theme => ({
  root: {
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

const roots = [
  // each array in this roots array  is a group which will
  // be separated by a divider

  [
    // each array contains root 'objects' or root 'objectGroup'
    // the difference is that objectGroups contain group: true

    { // this is an individual root
      text: 'Home',
      icon: <HomeIcon/>,
      path: '/app',
    },

    { // this is an individual root
      text: 'Logout',
      icon: <LockIcon/>,
      path: '/logout',
    },

    { // this is a root group
      group: true,
      text: 'Party',
      icon: <PeopleIcon/>,
      roots: [
        { // this is an individual root
          text: 'Company',
          icon: <DomainIcon/>,
          path: '/app/party/company',
        },
        {
          text: 'Client',
          icon: <PeopleIcon/>,
          path: '/app/party/client',
        },
        {
          text: 'User',
          icon: <PersonIcon/>,
          path: '/app/party/user',
        },
      ],
    },
  ],

  // -------- divider here --------

  // [
  //   { // this is an individual root
  //     text: 'Client',
  //     icon: <PeopleIcon/>,
  //   },
  //
  //   { // this is a root group
  //     group: true,
  //     text: 'Party',
  //     icon: <PeopleIcon/>,
  //     roots: [
  //       { // this is an individual root
  //         text: 'Company',
  //         icon: <DomainIcon/>,
  //       },
  //       {
  //         text: 'Client',
  //         icon: <PeopleIcon/>,
  //       },
  //       {
  //         text: 'User',
  //         icon: <PersonIcon/>,
  //       },
  //     ],
  //   },
  // ],
]

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
    roots.forEach((rootSection, rootSectionIdx) => {
      if (!menuState.hasOwnProperty(`${rootSectionIdx}`)) {
        menuState[`${rootSectionIdx}`] = {}
      }
      rootSection.forEach((rootGroupOrRoot, rootGroupOrRootIdx) => {
        if (rootGroupOrRoot.group) {
          menuState[`${rootSectionIdx}`][`${rootGroupOrRootIdx}`] = false
        }
      })
    })

    this.state = {
      open: true,
      mobileDrawerOpen: false,
      desktopDrawerOpen: true,
      menuState,
      path: '/app',
    }
  }

  toggleDesktopDrawer() {
    this.setState({desktopDrawerOpen: !this.state.desktopDrawerOpen})
  }

  toggleMobileDrawer() {
    this.setState({mobileDrawerOpen: !this.state.mobileDrawerOpen})
  }

  toggleMenuState(rootSectionIdx, rootGroupOrRootIdx) {
    let {
      menuState,
    } = this.state
    menuState[`${rootSectionIdx}`][`${rootGroupOrRootIdx}`] =
        !menuState[`${rootSectionIdx}`][`${rootGroupOrRootIdx}`]
    this.setState(menuState)
  }

  changePath(path) {
    const {
      history,
    } = this.props
    history.push(path)
    this.setState({path})
  }

  render() {
    const {classes} = this.props

    return (
        <div className={classes.root}>
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
                {roots.map((rootSection, rootSectionIdx) => {
                  return rootSection.map(
                      (rootGroupOrRoot, rootGroupOrRootIdx) => {
                        if (rootGroupOrRoot.group) {
                          return rootGroupOrRoot.roots.map(
                              (root, rootIdx) => {
                                return <Route
                                    key={`${rootSectionIdx}${rootGroupOrRootIdx}${rootIdx}`}
                                    exact
                                    path={root.path}
                                    render={() => <div>{root.path}</div>}
                                />
                              })
                        } else {
                          return <Route
                              key={`${rootSectionIdx}${rootGroupOrRootIdx}`}
                              exact
                              path={rootGroupOrRoot.path}
                              render={() => <div>{rootGroupOrRoot.path}</div>}
                          />
                        }
                      })
                })}
              </Switch>
            </div>
          </main>
        </div>
    )
  }

  renderDesktopDrawerAndToolbar() {
    const {classes, theme} = this.props
    const {desktopDrawerOpen} = this.state

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
            Mini variant drawer
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
    const {mobileDrawerOpen} = this.state

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
            Mini variant drawer
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
        {this.renderDrawerMenus()}
      </Drawer>
    </React.Fragment>
  }

  renderDrawerMenus() {
    const {
      classes,
    } = this.props

    const {menuState} = this.state
    return <React.Fragment>
      {roots.map((rootSection, rootSectionIdx) => {
        return <React.Fragment key={`${rootSectionIdx}`}>
          <List>
            {rootSection.map((rootGroupOrRoot, rootGroupOrRootIdx) => {
              if (rootGroupOrRoot.group) {
                return <React.Fragment
                    key={`${rootSectionIdx}${rootGroupOrRootIdx}`}>
                  <ListItem button onClick={() => this.toggleMenuState(
                      rootSectionIdx, rootGroupOrRootIdx)}>
                    <ListItemIcon>
                      {rootGroupOrRoot.icon}
                    </ListItemIcon>
                    <ListItemText inset primary={rootGroupOrRoot.text}/>
                    {menuState[`${rootSectionIdx}`][`${rootGroupOrRootIdx}`] ?
                        <ExpandLess/> :
                        <ExpandMore/>}
                  </ListItem>
                  <Collapse
                      in={menuState[`${rootSectionIdx}`][`${rootGroupOrRootIdx}`]}
                      timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {rootGroupOrRoot.roots.map((root, rootIdx) => {
                        return <ListItem
                            button
                            className={classes.nested}
                            key={`${rootSectionIdx}${rootGroupOrRootIdx}${rootIdx}`}
                            onClick={() => this.changePath(root.path)}
                        >
                          <ListItemIcon>
                            {root.icon}
                          </ListItemIcon>
                          <ListItemText inset primary={root.text}/>
                        </ListItem>
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              } else {
                return <ListItem
                    button
                    key={`${rootSectionIdx}${rootGroupOrRootIdx}`}
                    onClick={() => this.changePath(rootGroupOrRoot.path)}
                >
                  <ListItemIcon>
                    {rootGroupOrRoot.icon}
                  </ListItemIcon>
                  <ListItemText primary={rootGroupOrRoot.text}/>
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