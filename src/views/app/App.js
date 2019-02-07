import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  withStyles, Drawer, AppBar, Toolbar, List,
  Typography, Divider, IconButton, ListItemIcon,
  ListItemText, ListItem, Hidden,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

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
})

const roots = [
  [
    {
      text: 'hello',
      icon: <InboxIcon/>,
    },
    {
      text: 'hello',
      icon: <MailIcon/>,
    },
  ],
  [
    {
      text: 'goodbye',
      icon: <InboxIcon/>,
    },
    {
      text: 'happy',
      icon: <MailIcon/>,
    },

  ],
]

class MiniDrawer extends React.Component {
  state = {
    open: true,
    mobileOpen: false,
    desktopOpen: true,
  }

  handleDrawerOpen = () => {
    this.setState({open: true})
  }

  handleDrawerClose = () => {
    this.setState({open: false})
  }

  render() {
    const {classes, theme} = this.props

    return (
        <div className={classes.root}>
          <AppBar
              position='fixed'
              className={classNames(classes.appBar, {
                [classes.appBarShift]: this.state.open,
              })}
          >
            <Toolbar disableGutters={!this.state.open}>
              <IconButton
                  color='inherit'
                  aria-label='Open drawer'
                  onClick={this.handleDrawerOpen}
                  className={classNames(classes.menuButton, {
                    [classes.hide]: this.state.open,
                  })}
              >
                <MenuIcon/>
              </IconButton>
              <Typography variant='h6' color='inherit' noWrap>
                Mini variant drawer
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden xsDown>
            <Drawer
                variant='permanent'
                className={classNames(classes.drawer, {
                  [classes.drawerOpen]: this.state.open,
                  [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                  paper: classNames({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                  }),
                }}
                open={this.state.open}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ?
                      <ChevronRightIcon/> :
                      <ChevronLeftIcon/>}
                </IconButton>
              </div>
              <Divider/>
              {roots.map((rootGroup, groupIdx) => {
                return <React.Fragment key={`${groupIdx}`}>
                  <List>
                    {rootGroup.map((root, rootIdx) => {
                          return <ListItem button key={`${groupIdx}${rootIdx}`}>
                              <ListItemIcon>
                                {root.icon}
                              </ListItemIcon>
                            <ListItemText primary={root.text}/>
                          </ListItem>
                    })}
                  </List>
                  <Divider/>
                </React.Fragment>
              })}
            </Drawer>
          </Hidden>
          <Hidden smUp>
            <Drawer
                variant='temporary'
                className={classNames(classes.drawer, {
                  [classes.drawerOpen]: this.state.open,
                  [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                  paper: classNames({
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                  }),
                }}
                open={this.state.open}
            >
              <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ?
                      <ChevronRightIcon/> :
                      <ChevronLeftIcon/>}
                </IconButton>
              </div>
              <Divider/>
              {roots.map((rootGroup, groupIdx) => {
                return <React.Fragment key={`${groupIdx}`}>
                  <List>
                    {rootGroup.map((root, rootIdx) => {
                      return <ListItem button key={`${groupIdx}${rootIdx}`}>
                        <ListItemIcon>
                          {root.icon}
                        </ListItemIcon>
                        <ListItemText primary={root.text}/>
                      </ListItem>
                    })}
                  </List>
                  <Divider/>
                </React.Fragment>
              })}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar}/>
            <div>content</div>
          </main>
        </div>
    )
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, {withTheme: true})(MiniDrawer)