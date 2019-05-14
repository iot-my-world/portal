import React, {Component} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import appStyle from 'assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx'
import {withStyles} from '@material-ui/core'
import Sidebar from 'components/sidebar/Sidebar'

const styles = theme => ({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
    '&:after': {
      display: 'table',
      clear: 'both',
      content: '" "'
    }
  },
})

class App extends Component {
  state = {
    mobileOpen: false,
    miniActive: false
  }

  handleDrawerToggle = () => {

  }

  render(){
    const { classes, ...rest } = this.props
    const {mobileOpen, miniActive} = this.state

    const mainPanel =
      classes.mainPanel +
      " " +
      classNames({
        [classes.mainPanelSidebarMini]: miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
      })
    return (
      <div className={classes.wrapper}>
        <Sidebar
          handleDrawerToggle={this.handleDrawerToggle}
          open={mobileOpen}
          miniActive={miniActive}
        />
        <div className={mainPanel} ref="mainPanel">
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}
App.defaultProps = {}

App = withStyles(appStyle)(App)

export default App