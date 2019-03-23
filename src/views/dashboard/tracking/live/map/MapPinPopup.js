import React from 'react'
import {
  Popup,
} from 'react-map-gl'
import PropTypes from 'prop-types'
import {
  withStyles,
  Typography,
  Divider,
} from '@material-ui/core'
import moment from 'moment'
import {Reading} from 'brain/tracker/reading'

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  divider: {
    gridColumn: '1/3',
  },
})

let MapPinInfo = props => {
  const {
    open,
    reading,
    getPartyName,
    classes,
    ...rest
  } = props

  if (!open) {
    return null
  }

  return <Popup
      {...rest}
  >
    <div className={classes.root} style={{gridColumnGap: 8}}>
      <Typography variant={'body1'}>
        Device Type:
      </Typography>
      <Typography variant={'body1'}>
        {reading.deviceType}
      </Typography>
      <Divider className={classes.divider}/>

      <Typography variant={'body1'}>
        Location:
      </Typography>
      <Typography variant={'body2'}>
        {`${reading.latitude}, ${reading.longitude}`}
      </Typography>
      <Divider className={classes.divider}/>

      <Typography variant={'body1'}>
        Taken at:
      </Typography>
      <Typography variant={'body2'}>
        {moment.unix(reading.timeStamp).format('YYYY-MM-DD HH:mm:ss')}
      </Typography>
      <Divider className={classes.divider}/>
      <Divider className={classes.divider}/>

      <Typography variant={'body1'}>
        Owned By:
      </Typography>
      <Typography variant={'body2'}>
        {getPartyName(reading.ownerPartyType, reading.ownerId)}
      </Typography>
      <Divider className={classes.divider}/>

      <Typography variant={'body1'}>
        Assigned To:
      </Typography>
      <Typography variant={'body2'}>
        {getPartyName(reading.assignedPartyType, reading.assignedId)}
      </Typography>
    </div>
  </Popup>
}

MapPinInfo = withStyles(styles)(MapPinInfo)

MapPinInfo.propTypes = {
  ...Popup.propTypes,
  open: PropTypes.bool.isRequired,
  reading: PropTypes.instanceOf(Reading),
  getPartyName: PropTypes.func.isRequired,
}

MapPinInfo.defaultProps = {}

export default MapPinInfo
