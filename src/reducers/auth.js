import {
  setClaims,
  logout, setMyParty,
} from 'actions/actionTypes'
import {
  LoginClaims,
} from 'brain/security/claims/index'

const initState = {
  claims: new LoginClaims(),
  party: {},
}

export default function auth(state = initState, action) {
  switch (action.type) {
    case setClaims:
      return {
        ...state,
        claims: action.data,
      }

    case setMyParty:
      return {
        ...state,
        party: action.data,
      }

    case logout:
      return initState

    default:
      return state
  }
}