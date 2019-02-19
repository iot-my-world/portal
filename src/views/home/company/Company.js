import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  withStyles, Typography,
} from '@material-ui/core'

const styles = theme => ({})

class Company extends Component {
  render() {
    return <div>
      <Typography variant={'h4'} color={'primary'}>
        Company Home
      </Typography>
    </div>
  }
}

Company = withStyles(styles)(Company)

Company.propTypes = {

}

Company.defaultProps = {
  
}

export default Company