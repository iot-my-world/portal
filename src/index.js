import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import config from 'react-global-configuration'
import RootContainer from './views/root/RootContainer'
import reducers from './reducers'
import 'typeface-roboto'

const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

// Find host where this app is running i.e. localhost or 192.168 ...
const host = window && window.location && window.location.hostname

config.set(
    {
      apiServerUrl: `http://${host}:9006/api`,
      webSocketUrl: `ws://${host}:9008/ws`,
    }
)

ReactDOM.render(
    <Provider store={store}>
      <RootContainer/>
    </Provider>, document.querySelector('.container')
)