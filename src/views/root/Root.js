import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {withStyles} from '@material-ui/core'
import PropTypes from 'prop-types'
import ToastNotify from '../../components/notification/ToastNotify'
import AppContainer from '../app/AppContainer'
// import LoginContainer from '../login/LoginContainer'
import RegisterUserContainer
  from 'views/registrar/registerUser/RegisterUserContainer'
import {parseToken} from 'utilities/token/index'
import {HumanUserLoginClaims} from 'brain/security/claims'
import FullPageLoader from 'components/loader/FullPage'
import {Logout} from 'actions/auth'
import moment from 'moment'
import ResetPasswordContainer
  from 'views/registrar/resetPassword/ResetPasswordContainer'
import PublicContainer from 'views/public/PublicContainer'

const styles = theme => ({})

function willBeSetToLoggedIn() {
  try {
    const claims = parseToken(sessionStorage.getItem('jwt'))
    return claims.notExpired && claims.type === HumanUserLoginClaims.type
  } catch (e) {
    return false
  }
}

class Root extends Component {
  constructor(props) {
    super(props)
    this.determineLoggedIn = this.determineLoggedIn.bind(this)
    this.updateAllowedRoutes = this.updateAllowedRoutes.bind(this)
    this.state = {
      allowedRoutes: [],
    }
  }

  updateAllowedRoutes(newAllowedRoots) {
  }

  componentDidMount() {
    const {
      Login,
    } = this.props
    if (this.determineLoggedIn()) {
      Login()
    } else {
      Logout()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      loggedIn,
      claims,
      Logout,
    } = this.props
    const {
      loggedIn: prevLoggedIn,
    } = prevProps
    if (loggedIn !== prevLoggedIn) {
      if (loggedIn) {
        console.info(
            'Login Valid Until:',
            moment()
                .add(claims.timeToExpiry, 'ms')
                .format('dddd, MMMM Do YYYY, h:mm:ss a'),
        )
        setTimeout(() => Logout(), claims.timeToExpiry)
      } else {
        sessionStorage.removeItem('jwt')
      }
    }
  }

  determineLoggedIn() {
    const {SetClaims} = this.props
    try {
      const claims = parseToken(sessionStorage.getItem('jwt'))
      if (claims.notExpired && claims.type === HumanUserLoginClaims.type) {
        SetClaims(claims)
        return true
      } else {
        // if the token is expired clear the token state
        sessionStorage.setItem('jwt', null)
        return false
      }
    } catch (e) {
      sessionStorage.setItem('jwt', null)
      return false
    }
  }

  render() {
    const {
      claims,
      showGlobalLoader,
      // loggedIn,
      loggedOut
    } = this.props

    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Route
                  path='/app'
                  render={props => {
                    // if the app is done loading then we can check if
                    // this route is allowed
                    if (
                        this.loggedIn ||
                        claims.notExpired ||
                        (!loggedOut && willBeSetToLoggedIn())
                    ) {
                      return (
                          <AppContainer
                              updateAllowedRoutes={this.updateAllowedRoutes}
                              {...props}
                          />
                      )
                    } else {
                      return <Redirect to='/'/>
                    }
                  }}
              />
              <Route
                  path='/register'
                  render={props => {
                    return <RegisterUserContainer {...props} />
                  }}
              />
              <Route
                  path='/resetPassword'
                  render={props => {
                    return <ResetPasswordContainer {...props} />
                  }}
              />
              <Route
                  path='/'
                  // render={props => {
                  //   if (loggedIn && claims.notExpired) {
                  //     return <Redirect to='/app'/>
                  //   } else {
                  //     return <LoginContainer {...props} />
                  //   }
                  // }}
                  render={props => <PublicContainer {...props} />}
              />
            </Switch>
            <ToastNotify/>
            <FullPageLoader open={showGlobalLoader}/>
          </div>
        </BrowserRouter>
    )
  }
}

Root.propTypes = {
  SetClaims: PropTypes.func.isRequired,
  claims: PropTypes.instanceOf(HumanUserLoginClaims),
  /**
   * redux state flag indicating if the app
   * is loggedOut
   */
  loggedOut: PropTypes.bool.isRequired,
  /**
   * controls whether the app-wide full
   * page loader is open or not
   */
  showGlobalLoader: PropTypes.bool.isRequired,
  /**
   * redux state flag indicating if the app
   * is logged in
   */
  loggedIn: PropTypes.bool.isRequired,
  Login: PropTypes.func.isRequired,
  Logout: PropTypes.func.isRequired,
}

export default withStyles(styles)(Root)
