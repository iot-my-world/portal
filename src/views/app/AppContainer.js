import React from 'react'
import {connect} from 'react-redux'
import App from './App'

let AppContainer = props => {
  return <App {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

AppContainer = connect(
    mapStateToProps,
    {
    }
)(AppContainer)

export default AppContainer