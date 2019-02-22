import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Device extends Component {
  render(){
    return <div>Deivce</div>
  }
}

Device = withStyles(styles)(Device)

Device.propTypes = {}
Device.defaultProps = {}

export default Device