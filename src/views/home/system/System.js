import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class System extends Component {
  render() {
    return <div>User!</div>
  }
}

System = withStyles(styles)(System)

System.propTypes = {

}

System.defaultProps = {
  
}

export default System