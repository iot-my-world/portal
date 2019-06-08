import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class SF001 extends Component {
  render(){
    return <div>Deivce</div>
  }
}

SF001 = withStyles(styles)(SF001)

SF001.propTypes = {}
SF001.defaultProps = {}

export default SF001