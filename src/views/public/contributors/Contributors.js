import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Contributors extends Component {
  render(){
    return <div>Contributors</div>
  }
}

Contributors = withStyles(styles)(Contributors)

Contributors.propTypes = {}
Contributors.defaultProps = {}

export default Contributors