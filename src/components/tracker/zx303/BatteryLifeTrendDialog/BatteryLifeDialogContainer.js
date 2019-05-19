import React from 'react'
import {connect} from 'react-redux'
import BatteryLifeDialog from './BatteryLifeDialog'
import {HideGlobalLoader, ShowGlobalLoader} from 'actions/app'

let BatteryLifeDialogContainer = props => {
  return <BatteryLifeDialog {...props}/>
}

const mapStateToProps = (state) => {
  return {
  }
}

BatteryLifeDialogContainer = connect(
    mapStateToProps,
    {
      ShowGlobalLoader,
      HideGlobalLoader,
    }
)(BatteryLifeDialogContainer)

export default BatteryLifeDialogContainer