import React, {PureComponent} from 'react';

// import PropTypes from 'prop-types'
import {
  withStyles,
  Typography,
} from '@material-ui/core'

const styles = theme => ({
})

class MapPinInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.city}, ${info.state}`;

    return (
      <div>
        <Typography>
          {displayName} | <a target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}>
            Wikipedia
          </a>
        </Typography>
        <img alt="" width={240} src={info.image} />
      </div>
    );
  }
}

MapPinInfo = withStyles(styles)(MapPinInfo)

export default MapPinInfo
