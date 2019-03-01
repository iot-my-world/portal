import 'components/mapbox/Custom.css'

import React, {Component} from 'react'
import {
  withStyles,
} from '@material-ui/core'

import MapGL,
{
  Marker,
  Popup,
  // NavigationControl,
} from 'react-map-gl'

import {
  RecordHandler as ReadingRecordHandler,
  Reading,
} from 'brain/tracker/reading'
import {FullPageLoader} from 'components/loader'
import {Query} from 'brain/search'

import MapPin from './MapPin'
import MapPinInfo from './MapPinInfo'

const styles = theme => ({
  body: {
    margin: 0,
    background: '#000',
    width: '100vw',
    height: '100vh',
  },
})

const TOKEN = 'pk.eyJ1IjoiaW1yYW5wYXJ1ayIsImEiOiJjanJ5eTRqNzEwem1iM3lwazhmN3R1NWU4In0.FdWdZYUaovv2FY5QcQWVHg'
//https://stackoverflow.com/questions/36382725/converting-lat-long-values-received-from-gps-tracker
// south, err := toDMS(data[24:33])
// east, err := toDMS(data[35:44])


class Maps extends Component {

  constructor(props) {
    super(props)
    this.collect = this.collect.bind(this)
    this.state = {
      viewport: {
        latitude: -26.046573,
        longitude: 28.095451,
        zoom: 3.5,
        bearing: 0,
        pitch: 0,
      },
      popupInfo: null,
      isLoading: true,
    }
  }

  componentDidMount() {
    this.collect()
  }

  collect = async () => {
    const newQuery = new Query()
    newQuery.limit = 0

    const response = await ReadingRecordHandler.Collect([], newQuery)
    const readings = response.records.map(reading => new Reading(reading))
    // console.log(readings)

    const reading_data = this._getLocData(readings)
    //readings.slice(1,10)
    console.log(reading_data)

    this.setState({
      isLoading: false,
      locationData: reading_data

    })
  }

  _updateViewport = (viewport) => {
    this.setState({viewport})
  }

  _renderCityMarker = (city, index) => {
    return (
        <Marker
            key={`marker-${index}`}
            longitude={city['@lon']}
            latitude={city['@lat']}>
          <MapPin
              size={20}
              // onClick={() => this.setState({popupInfo: city})}
          />
        </Marker>
    )
  }

  _getLocData(readings) {
    return readings.map(function(elem) {
      return {
        // "@lat": this._transform(elem._southCoordinate, 's'),
        // "@lon": this._transform(elem._eastCoordinate, 'e'),
        "@lat": elem.latitude,
        "@lon": elem.longitude,
        "time": elem._timeStamp
      }
    }, this)
  }

  _transform(coord, dir) {
    coord = coord.replace(`"`, '')
    let degrees = parseFloat(coord.split('°')[0])
    let minutes = parseFloat(coord.split("'")[0].split('°')[1])
    let seconds = parseFloat(coord.split("'")[1])

    return this._convertDMSToDD(degrees, minutes, seconds, dir)
  }
  _convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === "s" || direction === "w") {
        dd = dd * -1;
    } // Don't do anything for north or east
    return dd;
  }

  _renderPopup() {
    const {
      popupInfo,
    } = this.state

    return popupInfo && (
        <Popup tipSize={5}
               anchor="top"
               longitude={popupInfo.longitude}
               latitude={popupInfo.latitude}
               closeOnClick={false}
               onClose={() => this.setState({popupInfo: null})}>
          <MapPinInfo info={popupInfo}/>
        </Popup>
    )
  }

  render() {
    const {
      viewport,
      isLoading,
    } = this.state

    if (isLoading) {
      return <FullPageLoader open={isLoading}/>
    }

    return (
        <MapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/dark-v9"
            onViewportChange={this._updateViewport}
            mapboxApiAccessToken={TOKEN}
        >
        {this.state.locationData.map(this._renderCityMarker)}
        {this._renderPopup()}


        </MapGL>
    )
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
