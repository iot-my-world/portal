import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Paper, Tabs, Tab,
  Grid,
} from '@material-ui/core'
import {
  TK102,
} from 'brain/tracker/device/types'
import TK102Container from './tk102/TK102Container'

const styles = theme => ({
  tabRoot: {
    flexGrow: 1,
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
    const {classes} = this.props
    const {activeTab} = this.state
    return <Grid container direction={'column'} spacing={8}>
      <Grid item>
        <Paper className={classes.root}>
          <Tabs
              value={activeTab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              centered
          >
            <Tab label={TK102} value={tabs.TK102}/>
          </Tabs>
        </Paper>
      </Grid>
      <Grid item>
        {this.renderTabContent()}
      </Grid>
    </Grid>
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

Device.propTypes = {}
Device.defaultProps = {}

export default Device