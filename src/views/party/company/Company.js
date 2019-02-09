import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Grid,
} from '@material-ui/core'

const styles = theme => ({})

class Company extends Component {
  render() {
    return <Grid container direction='row'>

    </Grid>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company