import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tabs, Tab, Grid, Card, AppBar, CardContent,
} from '@material-ui/core'
import {
  TK102,
} from 'brain/tracker/device/types'
import TK102Container from './tk102/TK102Container'

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
  TK102: 0,
}

class Device extends Component {
  constructor(props) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.renderTabContent = this.renderTabContent.bind(this)
    this.state = {
      activeTab: tabs.TK102,
    }
  }

  handleTabChange(event, value) {
    this.setState({activeTab: value})
  }

  render() {
    const {classes, maxViewDimensions} = this.props
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
                style={{width: maxViewDimensions.width}}
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
                      value={tabs.TK102}
                      label={'TK102'}
                  />
                </Tabs>
              </AppBar>
              <CardContent
                  classes={{root: classes.cardContent}}
                  style={{
                    height: maxViewDimensions.height - 95,
                  }}
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