import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import config from 'react-global-configuration'
import RootContainer from './views/root/RootContainer'
import reducers from './reducers/index'

import "assets/scss/material-dashboard-pro-react.css?v=1.2.0"

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
)

let hostName = 'localhost'
let host = 'localhost'
try {
  if (window.location.hostname.includes('www')) {
    hostName = window.location.hostname.split('.')[1]
    host = window.location.hostname
  } else if (window.location.hostname !== 'localhost') {
    hostName = window.location.hostname
    host = window.location.hostname
  }
} catch (e) {
  console.error('error determining hostname', e)
}

switch (hostName) {
  case 'iotmyworld':
    config.set({
      brainAPIUrl: `https://${host}/api-1`,
      // webSocketUrl: `wss://${host}/ws`,
    })
    break

  case 'localHost':
  default:
    config.set({
      brainAPIUrl: `http://${host}:9010/api-1`,
      // webSocketUrl: `ws://${host}:9008/ws`,
    })
}

ReactDOM.render(
    <Provider store={store}>
      <RootContainer/>
    </Provider>, document.querySelector('.container'),
)