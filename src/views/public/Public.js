import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, AppBar, Toolbar, Tabs, Tab
} from '@material-ui/core'
import backgroundImage from 'assets/images/websiteBackground.jpg'
import logoHorizontalTransparent
  from 'assets/images/logo/logo_horizontal_transparent.png'
import withWidth, {isWidthUp} from '@material-ui/core/withWidth/withWidth'
import classNames from 'classnames'
import {
  InfoIcon, LoginIcon, GithubIcon,
} from 'components/icon'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'

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
    overflow: 'hidden',
    height: '100vh',
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
  },
  viewContentOuterWrapper: {
    display: 'grid',
    overflow: 'hidden',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
  },
  viewContentInnerWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 8px 8px black',
    margin: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  viewContent: {
  },
})

const tabs = {
  info: {
    idx: 0,
    path: '/',
  },
  contributors: {
    idx: 1,
    path: '/contributors',
  },
  login: {
    idx: 2,
    path: '/login',
  },
}

class Public extends Component {
  state = {
    activeTabIdx: tabs.info.idx,
  }

  handleTabChange = (event, value) => {
    this.setState({activeTabIdx: value})
  }

  render() {
    const {
      activeTabIdx,
    } = this.state
    const {
      classes,
      width,
      history,
    } = this.props

    const mobileActive = !isWidthUp('md', width)

    return (
      <div
        className={classes.loginFullPageBackground}
        style={{backgroundImage: 'url(' + backgroundImage + ')'}}
      >
        <div className={classes.root}>
          <AppBar
            position="static"
          >
            <Toolbar classes={{root: classes.toolbarRoot}}>
              <div className={classes.toolBarContent}>
                <img
                  className={classNames(
                    classes.logo,
                    {[classes.logoMobile]: mobileActive},
                  )}
                  src={logoHorizontalTransparent}
                  alt={'logo'}
                />
                <Tabs
                  value={activeTabIdx}
                  onChange={this.handleTabChange}
                >
                  <Tab
                    onClick={()=>history.push(tabs.info.path)}
                    value={tabs.info.idx}
                    icon={<InfoIcon className={classes.icon}/>}
                  />
                  <Tab
                    onClick={()=>history.push(tabs.contributors.path)}
                    value={tabs.contributors.idx}
                    icon={<GithubIcon className={classes.icon}/>}
                  />
                  <Tab
                    onClick={()=>history.push(tabs.login.path)}
                    value={tabs.login.idx}
                    icon={<LoginIcon className={classes.icon}/>}
                  />
                </Tabs>
              </div>
            </Toolbar>
          </AppBar>
          <div className={classes.viewContentOuterWrapper}>
            <div className={classes.viewContentInnerWrapper}>
              <div
                className={classes.viewContent}
              >
                <Switch>
                  <Route
                    exact
                    path={tabs.info.path}
                    component={()=><div>info</div>}
                  />
                  <Route
                    path={tabs.contributors.path}
                    component={()=><div>contributors</div>}
                  />
                  <Route
                    path={tabs.login.path}
                    component={()=><div>login</div>}
                  />
                  <Route
                    path={'/'}
                    render={() => <Redirect to='/'/>}
                  />
                </Switch>
              </div>
            </div>
          </div>
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