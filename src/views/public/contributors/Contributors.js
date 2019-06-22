import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core'

const styles = theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 5px 5px black',
    display: 'flex',
    justifyContent: 'center',
    margin: '10px',
  },
})

class Contributors extends Component {
  render(){
    const {classes} = this.props
    return (
      <div
        className={classes.root}
        style={{
          height: 1000,
        }}
      >
        Contributors!
      </div>
    )
  }
}

Contributors = withStyles(styles)(Contributors)

Contributors.propTypes = {}
Contributors.defaultProps = {}

export default Contributors