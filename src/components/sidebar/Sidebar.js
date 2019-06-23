import React from 'react'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'perfect-scrollbar'
import {NavLink} from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles, Drawer, List,
  ListItem, ListItemIcon, ListItemText,
  Hidden, Collapse,
} from '@material-ui/core'
import sidebarStyle from './style'
import avatar from 'assets/images/user.png'
import logo from 'assets/images/logo/logo_emblem.png'
import image from 'assets/images/sidebar-min.png'
import User from 'brain/user/human/User'
import LockIcon from '@material-ui/icons/Lock'

let perfectScrollbarInst

class SidebarWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.sidebarWrapperRef = React.createRef()
  }

  componentDidMount() {
    if (this.sidebarWrapperRef && this.sidebarWrapperRef.current) {
      if (navigator.platform.indexOf('Win') > -1) {
        perfectScrollbarInst = new PerfectScrollbar(
          this.sidebarWrapperRef.current, {
            suppressScrollX: true,
            suppressScrollY: false,
          })
      }
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbarInst.destroy()
    }
  }

  render() {
    const {className, user, links} = this.props
    return (
      <div className={className} ref={this.sidebarWrapperRef}>
        {user}
        {links}
      </div>
    )
  }
}

class Sidebar extends React.Component {

  constructor(props) {
    super(props)
    this.mainPanelRef = React.createRef()
  }

  state = {
    openAvatar: false,
    miniActive: true,
  }

  activeRoute = routeName => {
    return this.props.location.pathname.indexOf(routeName) > -1
  }

  openCollapse(collapse) {
    var st = {}
    st[collapse] = !this.state[collapse]
    this.setState(st)
  }

  render() {
    const {
      classes,
      appRoutes,
      user: loggedInUser,
      history,
      Logout,
    } = this.props

    const itemText =
      classes.itemText +
      ' ' +
      classNames({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
      })
    const collapseItemText =
      classes.collapseItemText +
      ' ' +
      classNames({
        [classes.collapseItemTextMini]:
        this.props.miniActive && this.state.miniActive,
      })

    const user = (
      <div className={classes.user}>
        <div className={classes.photo}>
          <img src={avatar} className={classes.avatarImg} alt="..."/>
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + ' ' + classes.userItem}>
            <NavLink
              to={'#'}
              className={classes.itemLink + ' ' + classes.userCollapseButton}
              onClick={() => this.openCollapse('openAvatar')}
            >
              <ListItemText
                primary={loggedInUser.name}
                secondary={
                  <b
                    className={
                      classes.caret +
                      ' ' +
                      classes.userCaret +
                      ' ' +
                      (this.state.openAvatar ? classes.caretActive : '')
                    }
                  />
                }
                disableTypography={true}
                className={itemText + ' ' + classes.userItemText}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={classes.list + ' ' + classes.collapseList}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={appRoutes.userProfileRoute.path}
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <ListItemIcon className={classes.collapseItemIcon}>
                      <appRoutes.userProfileRoute.icon/>
                    </ListItemIcon>
                    <ListItemText
                      primary={'Profile'}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={appRoutes.partyProfileRoute.path}
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <ListItemIcon className={classes.collapseItemIcon}>
                      <appRoutes.partyProfileRoute.icon/>
                    </ListItemIcon>
                    <ListItemText
                      primary={appRoutes.partyProfileRoute.name}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to={'#'}
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                    onClick={Logout}
                  >
                    <ListItemIcon className={classes.collapseItemIcon}>
                      <LockIcon/>
                    </ListItemIcon>
                    <ListItemText
                      primary={'Logout'}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    )
    const links = (
      <List className={classes.list}>
        {appRoutes.sidebarLinkRoutes.map((prop, key) => {
          if (prop.redirect) {
            return null
          }
          if (prop.collapse) {
            const navLinkClasses =
              classes.itemLink +
              ' ' +
              classNames({
                [' ' + classes.collapseActive]: this.activeRoute(prop.path),
              })
            const itemText =
              classes.itemText +
              ' ' +
              classNames({
                [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive,
              })
            const collapseItemText = classNames(
                classes.collapseItemText,
                {
                  [classes.collapseItemTextMini]:
                  this.props.miniActive && this.state.miniActive,
                },
              )

            return (
              <ListItem key={key} className={classes.item}>
                <NavLink
                  to={'#'}
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={classes.itemIcon}>
                    <prop.icon/>
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          classes.caret +
                          ' ' +
                          (this.state[prop.state] ? classes.caretActive : '')
                        }
                      />
                    }
                    disableTypography={true}
                    className={itemText}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={classes.list + ' ' + classes.collapseList}>
                    {prop.views.map((prop, key) => {

                      if (prop.redirect) {
                        return null
                      }

                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink
                            to={prop.path}
                            className={classNames(
                              classes.collapseItemLink,
                              {[classes.blue]: this.activeRoute(prop.path)},
                            )}
                          >
                            {prop.icon
                              ? (
                                <ListItemIcon className={classes.collapseItemIcon}>
                                  <prop.icon/>
                                </ListItemIcon>
                              )
                              : (
                                <span className={classes.collapseItemMini}>
                                  {prop.mini}
                                </span>
                              )
                            }
                            <ListItemText
                              primary={prop.name}
                              disableTypography={true}
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      )
                    })}
                  </List>
                </Collapse>
              </ListItem>
            )
          }
          const navLinkClasses =
            classes.itemLink +
            ' ' +
            classNames({
              [' ' + classes.blue]: this.activeRoute(prop.path),
            })
          const itemText =
            classes.itemText +
            ' ' +
            classNames({
              [classes.itemTextMini]:
              this.props.miniActive && this.state.miniActive,
            })
          return (
            <ListItem key={key} className={classes.item}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={classes.itemIcon}>
                  <prop.icon/>
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography={true}
                  className={itemText}
                />
              </NavLink>
            </ListItem>
          )
        })}
      </List>
    )

    const logoNormal =
      classNames(
        classes.logoNormal,
        {
          [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        }
      )

    const brand = (
      <div
        className={classes.logo}
        onClick={() => history.push(appRoutes.partyHomeViewRoute.path)}
      >
        <img src={logo} alt="logo" className={classes.logoImg}/>
        <div className={logoNormal}>
          SpotNav
        </div>
      </div>
    )
    const drawerPaper =
      classes.drawerPaper +
      ' ' +
      classNames({
        [classes.drawerPaperMini]:
        this.props.miniActive && this.state.miniActive,
      })
    const sidebarWrapper =
      classes.sidebarWrapper +
      ' ' +
      classNames({
        [classes.drawerPaperMini]:
        this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
      })
    return (
      <div ref={this.mainPanelRef}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={'right'}
            open={this.props.open}
            classes={{
              paper: drawerPaper + ' ' + classes.blackBackground,
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{backgroundImage: 'url(' + image + ')'}}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            onMouseOver={() => this.setState({miniActive: false})}
            onMouseOut={() => this.setState({miniActive: true})}
            anchor={'left'}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + ' ' + classes.blackBackground,
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{backgroundImage: 'url(' + image + ')'}}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

Sidebar.defaultProps = {}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  appRoutes: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  miniActive: PropTypes.bool.isRequired,
  /**
   * Logged in user from redux
   */
  user: PropTypes.instanceOf(User).isRequired,
  Logout: PropTypes.func.isRequired,
}

export default withStyles(sidebarStyle)(Sidebar)
