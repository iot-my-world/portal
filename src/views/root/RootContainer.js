import React, {Component} from 'react'
import {connect} from 'react-redux'
import Root from './Root'
import {MuiThemeProvider} from '@material-ui/core'
import {
  themeOptions, getTheme,
} from 'theme/options'
import {
  SetClaims, Logout,
} from 'actions/auth'

class RootContainer extends Component {

  state = {
    chosenThemeOption: themeOptions.default,
  }

  theme = getTheme(this.state.chosenThemeOption)

  render () {
    const {
      SetClaims,
      Logout,
      claims,
    } = this.props

    return <MuiThemeProvider theme={this.theme}>
      <Root
          SetClaims={SetClaims}
          Logout={Logout}
          claims={claims}
      />
    </MuiThemeProvider>
  }
}

function mapStateToProps(state) {
  return {
    claims: state.auth.claims,
  }
}

export default connect(
    mapStateToProps,
    {
      SetClaims,
      Logout,
    },
)(RootContainer)