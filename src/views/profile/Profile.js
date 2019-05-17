import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  Tabs, Tab, AppBar,
} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import GeneralContainer from './general/GeneralContainer'
import SecurityContainer from './security/SecurityContainer'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
  rootCard: {},
})

const tabs = {
  general: 0,
  security: 1,
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.renderTabContent = this.renderTabContent.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.state = {
      activeTab: tabs.general,
    }
  }

  renderTabContent() {
    const {activeTab} = this.state

    switch (activeTab) {
      case tabs.general:
        return <GeneralContainer/>
      case tabs.security:
        return <SecurityContainer/>
      default:
        return null
    }
  }

  handleTabChange(muiClass, nextTab) {
    this.setState({activeTab: nextTab})
  }

  render() {
    const {classes} = this.props
    const {activeTab} = this.state

    return (
        <Grid
            container
            direction='column'
            spacing={8}
            alignItems='center'
            className={classes.root}
        >
          <Grid item>
            <Card className={classes.rootCard}>
              <AppBar position="static">
                <Tabs
                    value={activeTab}
                    onChange={this.handleTabChange}
                    variant="scrollable"
                    scrollButtons="on"
                >
                  <Tab
                      value={tabs.general}
                      label="General"
                      icon={<PersonIcon/>}
                  />
                  <Tab
                      value={tabs.security}
                      label="Security"
                      icon={<LockIcon/>}
                  />
                </Tabs>
              </AppBar>
              <CardContent>
                {this.renderTabContent()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }
}

Profile = withStyles(styles)(Profile)

Profile.propTypes = {
}
Profile.defaultProps = {}

export default Profile