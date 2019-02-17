import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {
  Typography,
  withStyles,
} from '@material-ui/core'

const styles = theme => ({})

class Client extends Component {
  render() {
    return <div>
      <Typography variant={'h4'} color={'primary'}>
        Client Home
      </Typography>
    </div>
  }
}

Client = withStyles(styles)(Client)

Client.propTypes = {

}

Client.defaultProps = {
  
}

export default Client