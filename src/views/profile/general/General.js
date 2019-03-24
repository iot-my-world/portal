import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class General extends Component {
  render() {
    return <div>General</div>
  }
}

General = withStyles(styles)(General)

General.propTypes = {}
General.defaultProps = {}

export default General