import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import {Switch, Route, Redirect} from 'react-router-dom'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import {
  withStyles,
} from '@material-ui/core'
import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'

import appRoutes from './routes'

import style from './style'
import LoadingScreen from 'views/app/LoadingScreen'
import HumanUserLoginClaims from 'brain/security/claims/login/user/human/Login'
import PermissionHandler from 'brain/security/permission/handler/Handler'
import User from 'brain/user/human/User'
import PartyAdministrator from 'brain/party/administrator/Administrator'
import UserAdministrator from 'brain/user/human/Administrator'

const switchRoutes = (
  <Switch>
    {appRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key}/>
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key}/>
          )
        })
      return <Route path={prop.path} component={prop.component} key={key}/>
    })}
  </Switch>
)

let perfectScrollbarInst

class App extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
    appLoading: true,
  }

  constructor(props) {
    super(props)
    this.mainPanelRef = React.createRef()
  }

  setup = async () => {
    const {
      claims,
      SetViewPermissions,
      NotificationFailure,
      Logout,
      SetMyParty,
      SetMyUser,
    } = this.props

    // catch in case setup starts before claims are set
    // when the claims are set later on componentDidUpdate will catch
    // and start setup again
    if (!claims.notExpired) {
      return
    }

    // load view permissions
    let viewPermissions = []
    try {
      // TODO: remove redundant passing of user id
      const response = await PermissionHandler.GetAllUsersViewPermissions({
        userIdentifier: claims.userId,
      })
      // update view permissions in state
      SetViewPermissions(response.permission)
      viewPermissions = response.permission
    } catch (e) {
      console.error('error getting view permissions', e)
      NotificationFailure('error logging in')
      Logout()
      return
    }

    // load party
    let party
    try {
      const response = await PartyAdministrator.GetMyParty()
      SetMyParty(response.party)
      party = response.party
    } catch (e) {
      console.error('error getting my party', e)
      NotificationFailure('error logging in')
      Logout()
      return
    }

    // load user
    let user
    try {
      const response = await UserAdministrator.GetMyUser()
      SetMyUser(response.user)
      user = response.user
    } catch (e) {
      console.error('error getting my user', e)
      NotificationFailure('error logging in')
      Logout()
      return
    }
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen})
  }

  componentDidMount() {
    // set perfect scrollbar if we are on windows
    if (navigator.platform.indexOf('Win') > -1) {
      if (this.mainPanelRef && this.mainPanelRef.current) {
        perfectScrollbarInst = new PerfectScrollbar(this.mainPanelRef.current, {
          suppressScrollX: true,
          suppressScrollY: false,
        })
        document.body.style.overflow = 'hidden'
      }
    }
    // call setup to load app
    this.setup()
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbarInst.destroy()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      history,
      location,
      claims: prevClaims,
      appDoneLoading: prevAppDoneLoading,
    } = prevProps
    const {
      claims,
      appDoneLoading,
    } = this.props

    // scroll the main page panel to the top if the path changes
    if (history.location.pathname !== location.pathname) {
      if (this.mainPanelRef && this.mainPanelRef.current) {
        this.mainPanelRef.current.scrollTop = 0
      }
      if (this.state.mobileOpen) {
        this.setState({mobileOpen: false})
      }
    }

    // restart setup in case setup was called before claims
    // were set
    if (
      (prevClaims.notExpired !== claims.notExpired) &&
      claims.notExpired
    ) {
      this.setup()
      return
    }

    if (
      (prevAppDoneLoading !== appDoneLoading)
      && appDoneLoading
    ) {
      console.log('app done loading')
      this.setState({appLoading: false})
    }
  }

  sidebarMinimize = () => {
    this.setState({miniActive: !this.state.miniActive})
  }

  render() {
    const {classes, user, ...rest} = this.props
    const {miniActive, mobileOpen, appLoading} = this.state

    if (appLoading) {
      return <LoadingScreen/>
    }

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={appRoutes}
          handleDrawerToggle={this.handleDrawerToggle}
          open={mobileOpen}
          miniActive={miniActive}
          user={user}
          {...rest}
        />
        <div
          className={
            classes.mainPanel + ' ' +
            cx({
              [classes.mainPanelSidebarMini]: miniActive,
              [classes.mainPanelWithPerfectScrollbar]:
              navigator.platform.indexOf('Win') > -1,
            })
          }
          ref={this.mainPanelRef}
        >
          <Header
            sidebarMinimize={this.sidebarMinimize}
            miniActive={miniActive}
            routes={appRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>
              {switchRoutes}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,

  /**
   * Flag which goes true when all desired set
   * flags from redux are true
   */
  appDoneLoading: PropTypes.bool.isRequired,

  /**
   * Login claims from redux state
   */
  claims: PropTypes.instanceOf(HumanUserLoginClaims),

  /**
   * Failure Action Creator
   */
  NotificationFailure: PropTypes.func.isRequired,

  /**
   * Logout action creator
   */
  Logout: PropTypes.func.isRequired,

  /**
   * SetViewPermissions action creator
   */
  SetViewPermissions: PropTypes.func.isRequired,
  /**
   * View permissions from redux
   */
  viewPermissions: PropTypes.array.isRequired,

  /**
   * SetMyUser action creator
   */
  SetMyUser: PropTypes.func.isRequired,
  /**
   * Logged in user from redux
   */
  user: PropTypes.instanceOf(User).isRequired,
  /**
   * SetMyParty action creator
   */
  SetMyParty: PropTypes.func.isRequired,
  /**
   * party of logged in user from redux
   */
  party: PropTypes.object.isRequired,
}

export default withStyles(style)(App)
