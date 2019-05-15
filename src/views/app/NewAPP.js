import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import {Switch, Route, Redirect} from 'react-router-dom'
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import {
  withStyles,
} from '@material-ui/core'
import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'

import dashboardRoutes from './newRoutes'

import style from './style'

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
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

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false,
  }

  constructor(props) {
    super(props)
    this.mainPanelRef = React.createRef()
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen})
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      if (this.mainPanelRef && this.mainPanelRef.current) {
        perfectScrollbarInst = new PerfectScrollbar(this.mainPanelRef.current, {
          suppressScrollX: true,
          suppressScrollY: false,
        })
        document.body.style.overflow = 'hidden'
      }
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollbarInst.destroy()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.history.location.pathname !== prevProps.location.pathname) {
      if (this.mainPanelRef && this.mainPanelRef.current) {
        this.mainPanelRef.current.scrollTop = 0
      }
      if (this.state.mobileOpen) {
        this.setState({mobileOpen: false})
      }
    }
  }

  sidebarMinimize = () => {
    this.setState({miniActive: !this.state.miniActive})
  }

  render() {
    const {classes, ...rest} = this.props
    const mainPanel =
      classes.mainPanel +
      ' ' +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
      })
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref={this.mainPanelRef}>
          <Header
            sidebarMinimize={this.sidebarMinimize}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(style)(Dashboard)
