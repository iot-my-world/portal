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
    this.updateDimensions = this.updateDimensions.bind(this)
    this.determineLoggedIn = this.determineLoggedIn.bind(this)
    this.state = {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
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
      } else {
        // if the token is expired clear the token state
        localStorage.setItem('jwt', null)
      }
    } catch (e) {
      localStorage.setItem('jwt', null)
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
    this.determineLoggedIn()
  }

  updateDimensions() {
    this.setState({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
    })
  }

  render() {
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
                  if (claims.notExpired) {
                    return <AppContainer
                        {...props}
                    />
                  } else {
                    return <Redirect to="/"/>
                  }
                }}
            />
            <Route
                exact
                path='/'
                render={(props) => {
                  if (claims.notExpired) {
                    return <Redirect to="/app"/>
                  } else {
                    return <LoginContainer
                        {...props}
                    />
                  }
                }}
            />
            <Route
                path='/'
                render={() => <Redirect to="/"/>}
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
  claims: PropTypes.instanceOf(Claims),
}

export default withStyles(styles)(Root)