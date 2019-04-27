import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Tasks extends Component {
  render() {
    return <div>Deivce</div>
  }
}

Tasks = withStyles(styles)(Tasks)

Tasks.propTypes = {}
Tasks.defaultProps = {}

export default Tasks