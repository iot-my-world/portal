import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card, Grid, withStyles, CardContent,
} from '@material-ui/core'
import ImageCapture from 'components/imageCapture/ImageCapture'
import {BarcodeScanner} from 'brain/barcode'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
})

class BarcodeTest extends Component {

  handleScanBarcode = async imageData => {
    try {
      const response = await BarcodeScanner.Scan({imageData})
      console.log('scanning response', response)
    } catch (e) {
      console.error('error scanning barcode', e)
    }
  }

  render() {
    const {classes} = this.props

    return (
        <Grid
            container
            direction='column'
            spacing={8}
            alignItems='center'
            className={classes.root}
        >
          <Grid item>
            <Card
                className={classes.rootCard}
            >
              <CardContent>
                <ImageCapture
                    onSave={this.handleScanBarcode}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }
}

BarcodeTest.propTypes = {
  /**
   * mui classes
   */
  classes: PropTypes.object.isRequired,
}
BarcodeTest.defaultProps = {}

BarcodeTest = withStyles(styles)(BarcodeTest)

export default BarcodeTest