import React, {Component} from 'react'
import {connect} from 'react-redux'
import Root from './Root'
import {MuiThemeProvider} from '@material-ui/core'
import {
  themeOptions, getTheme,
} from 'theme/options'

class RootContainer extends Component {

  state = {
    chosenThemeOption: themeOptions.default,
  }

  theme = getTheme(this.state.chosenThemeOption)

  render () {
    return <MuiThemeProvider theme={this.theme}>
      <Root/>
    </MuiThemeProvider>
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(
    mapStateToProps,
    {

    },
)(RootContainer)