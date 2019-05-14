import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  withStyles,
  Hidden,
  Drawer,
} from '@material-ui/core'
import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.jsx"

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
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
          </Drawer>
        </Hidden>
        <Hidden smDown>
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