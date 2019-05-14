import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"
import { Switch, Route, Redirect } from "react-router-dom"
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar"
import "perfect-scrollbar/css/perfect-scrollbar.css"

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"

// core components
import Header from "components/header/Header"
import Sidebar from "components/sidebar/Sidebar"

import dashboardRoutes from "./newRoutes"

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx"

import image from "assets/img/sidebar-2.jpg"
import logo from "assets/img/logo-white.svg"

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          )
        })
      return <Route path={prop.path} component={prop.component} key={key} />
    })}
  </Switch>
)

var ps

class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    miniActive: false
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps"
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      })
      document.body.style.overflow = "hidden"
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy()
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0
      if(this.state.mobileOpen){
        this.setState({mobileOpen: false})
      }
    }
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive })
  }
  render() {
    const { classes, ...rest } = this.props
    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
      })
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText={"Creative Tim"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          bgColor="black"
          miniActive={this.state.miniActive}
          {...rest}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(appStyle)(Dashboard)
