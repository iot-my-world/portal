import { combineReducers } from 'redux'
import auth from './auth'
import notification from './notification'
import permission from './permission'
import app from './app'

const rootReducer = combineReducers({
  app,
  auth,
  permission,
  notification,
})

export default rootReducer