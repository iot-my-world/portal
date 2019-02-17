import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class Company extends Component {
  render() {
    return <div>User!</div>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company