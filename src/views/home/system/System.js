import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Typography,
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class System extends Component {
  render() {
    return <div>
      <Typography variant={'h4'} color={'primary'}>
        System Home
      </Typography>
    </div>
  }
}

System = withStyles(styles)(System)

System.propTypes = {

}

System.defaultProps = {
  
}

export default System