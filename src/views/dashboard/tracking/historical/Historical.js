import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class Historical extends Component {
  render(){
    return <div>HistoricalTracking</div>
  }
}

Historical = withStyles(styles)(Historical)

Historical.propTypes = {}
Historical.defaultProps = {}

export default Historical