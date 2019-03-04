import React from 'react'
import {
  Popup,
} from 'react-map-gl'
import PropTypes from 'prop-types'
import {
  withStyles,
  Typography,
} from '@material-ui/core'

const styles = theme => ({})

let MapPinInfo = props => {
  const {
    open,
    ...rest
  } = props

  if (!open) {
    return null
  }

  console.log('open!')

  return <Popup
      {...rest}
  >
    <div>
      <Typography>
        hello test
      </Typography>
    </div>
  </Popup>
}

MapPinInfo = withStyles(styles)(MapPinInfo)

MapPinInfo.propTypes = {
  ...Popup.propTypes,
  open: PropTypes.bool.isRequired,
}

MapPinInfo.defaultProps = {}

export default MapPinInfo
