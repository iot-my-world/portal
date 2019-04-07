import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card, Grid, withStyles, CardContent,
} from '@material-ui/core'
import ImageCapture from 'components/imageCapture/ImageCapture'

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    margin: 0,
  },
})

class BarcodeTest extends Component {
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
                    onSave={imageData => console.log('image!', imageData)}
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