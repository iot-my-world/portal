import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  withStyles,
  Card,
  CardContent,
  Tabs, Tab, AppBar,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import GeneralContainer from './general/GeneralContainer'

const styles = theme => ({
  rootCard: {},
})

const tabs = {
  general: 0,
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
      default:
        return null
    }
  }

  handleTabChange(muiClass, nextTab) {
    this.setState({activeTab: nextTab})
  }

  render() {
    const {classes, maxViewDimensions} = this.props
    const {activeTab} = this.state

    return (
      <Grid container direction='column' spacing={8} alignItems='center'>
        <Grid item>
          <Card
            className={classes.rootCard}
            style={{width: maxViewDimensions.width}}
          >
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
  /**
   * maxViewDimensions from redux state
   */
  maxViewDimensions: PropTypes.object.isRequired,
}
Profile.defaultProps = {}

export default Profile