import {
  LoginSucceeded,
  LoginFailed,
} from '../actions/actionTypes'

const initState = {
  user: undefined,
}

export default function auth(state = initState, action) {
  switch (action.type) {
    case LoginSucceeded:
      console.log('login succeeded!')
      return state

    case LoginFailed:
      console.log('login failed!')
      return state

    default:
      return state
  }
}