import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import config from 'react-global-configuration'
import RootContainer from './views/root/RootContainer'
import reducers from './reducers/index'
import 'typeface-roboto'

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
)

let hostName = 'localhost'
let host = 'localhost'
try {
  hostName = window.location.hostname.split('.')[0]
  host = window.location.hostname
} catch (e) {
  console.error('error determining hostname', e)
}

switch (hostName) {
  case 'spotnav':
    config.set({
      brainAPIUrl: `https://${host}/api`,
      // webSocketUrl: `wss://${host}/ws`,
    })
    break

  case 'localHost':
  default:
    config.set({
      brainAPIUrl: `http://${host}:9010/api`,
      // webSocketUrl: `ws://${host}:9008/ws`,
    })
}

ReactDOM.render(
    <Provider store={store}>
      <RootContainer/>
    </Provider>, document.querySelector('.container'),
)