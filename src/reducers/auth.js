import {
  setClaims,
  logout,
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
      return {
        ...state,
        claims: action.data,
      }

    case logout:
      return initState

    default:
      return state
  }
}