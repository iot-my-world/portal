import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Security extends Component {
  render() {
    return <div>General</div>
  }
}

Security = withStyles(styles)(Security)

Security.propTypes = {}
Security.defaultProps = {}

export default Security