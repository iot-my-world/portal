import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, AppBar, Toolbar, Tabs, Tab,
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logoHorizontalTransparent from 'assets/images/logo/logo_horizontal_transparent.png'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth/withWidth'
import classNames from 'classnames'
import {
  InfoIcon, LoginIcon, GithubIcon,
} from 'components/icon'

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
  toolBarContent: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    justifyItems: 'center',
  },
  logo: {
    maxWidth: '500px',
    padding: '5px',
  },
  logoMobile: {
    width: `calc(100% - 10px)`,
  },
  icon: {
    fontSize: 25,
  }
})

const tabs = {
  home: 0,
  contributors: 1,
  login: 2,
}

class Public extends Component {
  state = {
    activeTab: tabs.home,
  }

  handleTabChange = (event, value) => {
    this.setState({activeTab: value})
  }

  render(){
    const {activeTab} = this.state
    const {
      classes,
      width,
    } = this.props

    const mobileActive = !isWidthUp('md', width)

    return (
      <div
        className={classes.loginFullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
      >
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar classes={{root: classes.toolbarRoot}}>
              <div className={classes.toolBarContent}>
                <img
                  className={classNames(
                    classes.logo,
                    {[classes.logoMobile]: mobileActive}
                  )}
                  src={logoHorizontalTransparent}
                  alt={'logo'}
                />
                <Tabs
                  value={activeTab}
                  onChange={this.handleTabChange}
                >
                  <Tab
                    value={tabs.home}
                    icon={<InfoIcon className={classes.icon}/>}
                  />
                  <Tab
                    value={tabs.contributors}
                    icon={<GithubIcon className={classes.icon}/>}
                  />
                  <Tab
                    value={tabs.login}
                    icon={<LoginIcon className={classes.icon}/>}
                  />
                </Tabs>
              </div>
            </Toolbar>
          </AppBar>
          <div>aweh</div>
        </div>
      </div>
    )
  }
}

Public.propTypes = {
  width: PropTypes.string,
}
Public.defaultProps = {}

Public = withWidth()(withStyles(styles)(Public))

export default Public