import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  withStyles,
  Hidden,
  Drawer,
} from '@material-ui/core'
import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.jsx"
import logo from "assets/img/logo-white.svg";

const styles = theme => ({})

class Sidebar extends Component {
  state = {
    miniActive: true
  }

  render(){
    const {classes, handleDrawerToggle, bgColor} = this.props

    const drawerPaper =
      classes.drawerPaper +
      " " +
      classNames({
        [classes.drawerPaperMini]:
        this.props.miniActive && this.state.miniActive,
      })


    const logoClasses =
      classes.logo +
      " " +
      classNames({
        [classes.whiteAfter]: bgColor === "white"
      })
    const logoNormal =
      classes.logoNormal +
      " " +
      classNames({
        [classes.logoNormalSidebarMini]:
        this.props.miniActive && this.state.miniActive,
      });
    const logoMini = classes.logoMini
    const spotNavBrand = (
      <div className={logoClasses}>
        <a href="https://www.creative-tim.com" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a>
        <a href="https://www.creative-tim.com" className={logoNormal}>
          {"Creative Tim"}
        </a>
      </div>
    )

    return (
      <div ref='mainPanel'>
        <Hidden mdUp>
          <Drawer
            anchor={'right'}
            open={this.props.open}
            variant='temporary'
            classes={{
              paper: drawerPaper + ' ' + classes[bgColor + 'Background']
            }}
            onClose={handleDrawerToggle}
            ModalProps={{keepMounted: true}}
          >
            {spotNavBrand}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          {spotNavBrand}
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={"left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  miniActive: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
}
Sidebar.defaultProps = {
  bgColor: "blue",
}

Sidebar = withStyles(sidebarStyle)(Sidebar)

export default Sidebar