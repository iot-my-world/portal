import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Tabs, Tab, Grid, Card, AppBar, CardContent,
} from '@material-ui/core'
import TasksContainer from './tasks/TasksContainer'

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
  state = {
    activeTab: tabs.tasks,
  }

  handleTabChange = (event, value) => {
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
        return <TasksContainer/>
      default:
        return <div>Invalid Tab Value</div>
    }
  }
}

ZX303 = withStyles(styles)(ZX303)

ZX303.propTypes = {
}
ZX303.defaultProps = {}

export default ZX303