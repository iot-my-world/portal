import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class Client extends Component {
  render() {
    return <div>User!</div>
  }
}

Client = withStyles(styles)(Client)

Client.propTypes = {

}

Client.defaultProps = {
  
}

export default Client