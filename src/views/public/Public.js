import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, AppBar, Toolbar,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logoTransparent from 'assets/images/logo/logo_transparent.png'

const styles = theme => ({
  loginFullPageBackground: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'block',
    top: '0',
    left: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'right top',
  },
  root: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
  },
  toolbarRoot: {
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    height: '200px',
  },
})

  class Public extends Component {
  render(){
    const {classes} = this.props
    return (
      <div
        className={classes.loginFullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
      >
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar classes={{root: classes.toolbarRoot}}>
              <img className={classes.logo} src={logoTransparent} alt={'logo'}/>
            </Toolbar>
          </AppBar>
          <div>aweh</div>
        </div>
      </div>
    )
  }
}

Public = withStyles(styles)(Public)

Public.propTypes = {}
Public.defaultProps = {}

export default Public