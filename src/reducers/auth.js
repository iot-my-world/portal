import {
  setClaims,
  logout,
} from 'actions/actionTypes'
import {
  LoginClaims,
} from 'brain/security/claims/index'

const initState = {
  claims: new LoginClaims(),
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