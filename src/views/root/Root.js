import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {withStyles} from '@material-ui/core'
import PropTypes from 'prop-types'
import ToastNotify from '../../components/notification/ToastNotify'
import AppContainer from '../app/AppContainer'
import LoginContainer from '../login/LoginContainer'
import {parseToken} from 'utilities/token/index'
import {Claims} from 'brain/security/auth'

const styles = theme => ({})

class Root extends Component {
  constructor(props) {
    super(props)
    this.determineLoggedIn = this.determineLoggedIn.bind(this)
    this.logout = this.logout.bind(this)

    this.state = {
      loggedIn: this.determineLoggedIn(),
    }
  }

  determineLoggedIn() {
    const {
      SetClaims,
    } = this.props
    try {
      const claims = parseToken(localStorage.getItem('jwt'))
      if (claims.notExpired) {
        SetClaims(claims)
        return true
      } else {
        // if the token is expired clear the token state
        localStorage.setItem('jwt', null)
        return false
      }
    } catch (e) {
      localStorage.setItem('jwt', null)
      return false
    }
  }

  logout(){
    const {
      Logout,
    } = this.props
    localStorage.removeItem('jwt')
    Logout()
    this.setState({loggedIn: false})
  }

  render() {
    const {
      loggedIn,
    } = this.state
    const {
      claims,
    } = this.props

    return <BrowserRouter>
      <div>
        <div>
          <Switch>
            <Route
                path='/app'
                render={(props) => {
                  if (loggedIn || claims.notExpired) {
                    return <AppContainer
                        {...props}
                    />
                  } else {
                    return <Redirect to='/'/>
                  }
                }}
            />
            <Route
                exact
                path='/logout'
                render={() => {
                  this.logout()
                  return <Redirect to='/'/>
                }}
            />
            <Route
                exact
                path='/'
                render={(props) => {
                  if (loggedIn || claims.notExpired) {
                    return <Redirect to='/app'/>
                  } else {
                    return <LoginContainer
                        {...props}
                    />
                  }
                }}
            />
          </Switch>
        </div>
        <ToastNotify/>
      </div>
    </BrowserRouter>
  }
}

Root.propTypes = {
  SetClaims: PropTypes.func.isRequired,
  Logout: PropTypes.func.isRequired,
  claims: PropTypes.instanceOf(Claims),
}

export default withStyles(styles)(Root)