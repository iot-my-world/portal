import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tabs, Tab, Grid, Card, AppBar, CardContent,
} from '@material-ui/core'
import TK102Container from './tk102/TK102Container'
import ZX303Container from './zx303/ZX303Container'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
  rootCard: {},
  cardContent: {
    display: 'grid',
    overflow: 'auto',
  },
})

const tabs = {
  ZX303: 0,
  TK102: 1,
}

class Device extends Component {
  constructor(props) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.renderTabContent = this.renderTabContent.bind(this)
    this.state = {
      activeTab: tabs.ZX303,
    }
  }

  handleTabChange(event, value) {
    this.setState({activeTab: value})
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
            <Card
                className={classes.rootCard}
            >
              <AppBar position="static">
                <Tabs
                    id={'deviceConfigurationTabBar'}
                    value={activeTab}
                    onChange={this.handleTabChange}
                    variant="scrollable"
                    scrollButtons="on"
                >
                  <Tab
                      value={tabs.ZX303}
                      label={'ZX303'}
                  />
                  <Tab
                      value={tabs.TK102}
                      label={'TK102'}
                  />
                </Tabs>
              </AppBar>
              <CardContent
                  classes={{root: classes.cardContent}}
              >
                {this.renderTabContent()}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }

  renderTabContent() {
    const {activeTab} = this.state
    switch (activeTab) {
      case tabs.TK102:
        return <TK102Container/>
      case tabs.ZX303:
        return <ZX303Container/>
      default:
        return <div>Invalid Tab Value</div>
    }
  }
}

Device = withStyles(styles)(Device)

Device.propTypes = {
  /**
   * maxViewDimensions from redux state
   */
  maxViewDimensions: PropTypes.object.isRequired,
}
Device.defaultProps = {}

export default Device