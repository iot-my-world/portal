import {
  setClaims,
  logout, setMyParty, setMyUser,
} from 'actions/actionTypes'
import {
  LoginClaims,
} from 'brain/security/claims/index'
import {User} from 'brain/party/user'

const initState = {
  claims: new LoginClaims(),
  party: {},
  user: new User(),
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

    case setMyUser:
      return {
        ...state,
        user: action.data,
      }

    case logout:
      return initState

    default:
      return state
  }
}