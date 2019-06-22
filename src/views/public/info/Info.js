import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Info extends Component {
  render(){
    return <div>Info</div>
  }
}

Info = withStyles(styles)(Info)

Info.propTypes = {}
Info.defaultProps = {}

export default Info