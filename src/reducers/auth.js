import {
  setClaims,
} from 'actions/actionTypes'
import {
  Claims,
} from 'brain/security/auth'

const initState = {
  claims: new Claims(),
}

export default function auth(state = initState, action) {
  switch (action.type) {
    case setClaims:
      state.claims = action.data
      return state

    default:
      return state
  }
}