import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Tabs, Tab, Grid, Card, AppBar, CardContent,
} from '@material-ui/core'

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
  tasks: 0,
}

class ZX303 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: tabs.ZX303,
    }
  }

  handleTabChange = (event, value) => {
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
            >
              <AppBar position="static">
                <Tabs
                    id={'zx303DeviceDiagnosticsTabBar'}
                    value={activeTab}
                    onChange={this.handleTabChange}
                    variant="scrollable"
                    scrollButtons="on"
                >
                  <Tab
                      value={tabs.tasks}
                      label={'Tasks'}
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

  renderTabContent = () => {
    const {activeTab} = this.state
    switch (activeTab) {
      case tabs.tasks:
        return <div>tasks</div>
      default:
        return <div>Invalid Tab Value</div>
    }
  }
}

ZX303 = withStyles(styles)(ZX303)

ZX303.propTypes = {
  /**
   * maxViewDimensions from redux state
   */
  maxViewDimensions: PropTypes.object.isRequired,
}
ZX303.defaultProps = {}

export default ZX303