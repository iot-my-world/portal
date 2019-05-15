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
import avatar from 'assets/img/faces/avatar.jpg'
import logo from 'assets/img/logo-white.svg'
import image from 'assets/img/sidebar-2.jpg'

let perfectScrollbarInst

class SidebarWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.sidebarWrapperRef = React.createRef()
  }

  componentDidMount() {
    if (this.sidebarWrapperRef && this.sidebarWrapperRef.current) {
      if (navigator.platform.indexOf('Win') > -1) {
        perfectScrollbarInst = new PerfectScrollbar(this.sidebarWrapperRef.current, {
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
      routes,
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
                primary={'Tania Andrew'}
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
                    to="#"
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <span className={classes.collapseItemMini}>
                      {'MP'}
                    </span>
                    <ListItemText
                      primary={'My Profile'}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={classes.itemLink + ' ' + classes.userCollapseLinks}
                  >
                    <span className={classes.collapseItemMini}>
                      {'EP'}
                    </span>
                    <ListItemText
                      primary={'Edit Profile'}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="#"
                    className={
                      classes.itemLink + ' ' + classes.userCollapseLinks
                    }
                  >
                    <span className={classes.collapseItemMini}>
                      {'S'}
                    </span>
                    <ListItemText
                      primary={'Settings'}
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
        {routes.map((prop, key) => {
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
            const collapseItemText =
              classes.collapseItemText +
              ' ' +
              classNames({
                [classes.collapseItemTextMini]:
                this.props.miniActive && this.state.miniActive,
              })

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
                      const navLinkClasses =
                        classes.collapseItemLink +
                        ' ' +
                        classNames({
                          [' ' + classes["blue"]]: this.activeRoute(prop.path),
                        })

                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink to={prop.path} className={navLinkClasses}>
                            <span className={classes.collapseItemMini}>
                              {prop.mini}
                            </span>
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
              [' ' + classes['blue']]: this.activeRoute(prop.path),
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
      classes.logoNormal +
      ' ' +
      classNames({
        [classes.logoNormalSidebarMini]:
        this.props.miniActive && this.state.miniActive,
      })
    const logoMini =
      classes.logoMini
    const logoClasses = classes.logo
    var brand = (
      <div className={logoClasses}>
        <a href="https://www.creative-tim.com" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img}/>
        </a>
        <a href="https://www.creative-tim.com" className={logoNormal}>
          {'SpotNav'}
        </a>
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

Sidebar.defaultProps = {
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object),
  handleDrawerToggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  miniActive: PropTypes.bool.isRequired,
}

export default withStyles(sidebarStyle)(Sidebar)
