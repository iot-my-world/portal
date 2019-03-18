import React, {Component} from 'react'
import {connect} from 'react-redux'
import Root from './Root'
import {MuiThemeProvider} from '@material-ui/core'
import {
  themeOptions, getTheme,
} from 'theme/options'
import {
  SetClaims,
} from 'actions/auth'
import {
  Logout, Login,
} from 'actions/auth'

class RootContainer extends Component {

  state = {
    chosenThemeOption: themeOptions.default,
  }

  theme = getTheme(this.state.chosenThemeOption)

  render() {

    return <MuiThemeProvider theme={this.theme}>
      <Root{...this.props}/>
    </MuiThemeProvider>
  }
}

function mapStateToProps(state) {
  return {
    claims: state.auth.claims,
    loggedIn: state.auth.loggedIn,
    doneLoading: state.app.doneLoading,
    showGlobalLoader: state.app.showGlobalLoader,
  }
}

export default connect(
    mapStateToProps,
    {
      SetClaims,
      Logout,
      Login,
    },
)(RootContainer)