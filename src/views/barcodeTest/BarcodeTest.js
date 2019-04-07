import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({})

class BarcodeTest extends Component {
  render() {
    return <div>Barcode</div>
  }
}

BarcodeTest = withStyles(styles)(BarcodeTest)

BarcodeTest.propTypes = {}
BarcodeTest.defaultProps = {}

export default BarcodeTest