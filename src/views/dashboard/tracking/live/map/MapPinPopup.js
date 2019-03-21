import React from 'react'
import {
  Popup,
} from 'react-map-gl'
import PropTypes from 'prop-types'
import {
  withStyles,
  Typography,
} from '@material-ui/core'
import moment from 'moment'
import {Reading} from 'brain/tracker/reading'

const styles = theme => ({})

let MapPinInfo = props => {
  const {
    open,
    reading,
    ...rest
  } = props

  if (!open) {
    return null
  }

  return <Popup
      {...rest}
  >
    <div>
      <Typography variant={'h6'}>
        Device
      </Typography>
      <Typography variant={'body1'}>
        Reading @ {moment.unix(reading.timeStamp).format('YYYY-MM-DD HH:mm:ss')}
      </Typography>
    </div>
  </Popup>
}

MapPinInfo = withStyles(styles)(MapPinInfo)

MapPinInfo.propTypes = {
  ...Popup.propTypes,
  open: PropTypes.bool.isRequired,
  reading: PropTypes.instanceOf(Reading),
}

MapPinInfo.defaultProps = {}

export default MapPinInfo
