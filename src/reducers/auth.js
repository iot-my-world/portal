import {
  setClaims,
} from '../actions/actionTypes'

const initState = {
  user: undefined,
}

export default function auth(state = initState, action) {
  switch (action.type) {
    case setClaims:
      console.log('login succeeded!')
      return state

    default:
      return state
  }
}