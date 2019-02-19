import '../../components/mapbox/Custom.css'

import React, {Component} from 'react'
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
// import PropTypes from 'prop-types'
import {
  withStyles,
} from '@material-ui/core'

import MapPin from './MapPin';
import MapPinInfo from './MapPinInfo';

const styles = theme => ({
    body: {
      margin: 0,
      background: "#000",
      width: "100vw",
      height: "100vh",
    },
})



const TOKEN = "pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg"



const CITIES =  [
    {
        "@lat": "-26.1497938",
        "@lon": "28.135012",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:33:01.777Z",
        "src": "network"
    },
    {
        "@lat": "-26.1500571",
        "@lon": "28.1351489",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:34:44.642Z",
        "src": "network"
    },
    {
        "@lat": "-26.1500487",
        "@lon": "28.1351646",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:35:50.097Z",
        "src": "network"
    },
    {
        "@lat": "-26.1498571",
        "@lon": "28.1350941",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:41:09.364Z",
        "src": "network"
    },
    {
        "@lat": "-26.1499881",
        "@lon": "28.1351294",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:42:23.476Z",
        "src": "network"
    },
    {
        "@lat": "-26.1498493",
        "@lon": "28.1350406",
        "ele": "1630.699951171875",
        "time": "2019-02-10T15:43:29.513Z",
        "src": "network"
    },
    {
        "@lat": "-26.150948885171083",
        "@lon": "28.151092282945598",
        "ele": "1622.445457790047",
        "time": "2019-02-10T15:52:40.867Z",
        "course": "0.0",
        "speed": "0.39919057",
        "src": "gps",
        "sat": "3",
        "hdop": "100.000",
        "ageofdgpsdata": "0"
    },
    {
        "@lat": "-26.150422145992877",
        "@lon": "28.150711568387358",
        "ele": "1630.8819362102076",
        "time": "2019-02-10T15:54:29.540Z",
        "course": "0.0",
        "speed": "0.6758557",
        "src": "gps",
        "sat": "3",
        "hdop": "100.000",
        "ageofdgpsdata": "0"
    },
    {
        "@lat": "-26.1499524",
        "@lon": "28.1351083",
        "ele": "1630.699951171875",
        "time": "2019-02-10T16:27:12.981Z",
        "src": "network"
    },
    {
        "@lat": "-26.1499141",
        "@lon": "28.135117",
        "ele": "1630.699951171875",
        "time": "2019-02-10T16:40:15.087Z",
        "src": "network"
    },
    {
        "@lat": "-26.1499141",
        "@lon": "28.135117",
        "ele": "1630.699951171875",
        "time": "2019-02-10T16:40:15.088Z",
        "src": "network"
    }
]

class Maps extends Component {


  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 3.5,
        bearing: 0,
        pitch: 0
      },
      popupInfo: null
    };
  }

  _updateViewport = (viewport) => {
    this.setState({viewport});
  }


  _renderCityMarker = (city, index) => {
      return (
        <Marker
          key={`marker-${index}`}
          longitude={parseFloat(city["@lon"])}
          latitude={parseFloat(city["@lat"])} >
          <MapPin size={20} onClick={() => this.setState({popupInfo: city})} />
        </Marker>
      );
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        closeOnClick={false}
        onClose={() => this.setState({popupInfo: null})} >
        <MapPinInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
        >
        { CITIES.map(this._renderCityMarker) }
        {this._renderPopup()}
      </MapGL>
    );
  }
}

Maps = withStyles(styles)(Maps)

// Maps.propTypes = {
//
// }
//
// Maps.defaultProps = {
//
// }

export default Maps
