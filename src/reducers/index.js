import { combineReducers } from 'redux'
import auth from './auth'
import notification from './notification'

const rootReducer = combineReducers({
  auth,
  notification,
})

export default rootReducer