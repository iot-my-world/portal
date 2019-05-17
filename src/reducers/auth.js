import {
  setClaims,
  logout, login,
  setMyParty, setMyUser,
} from 'actions/actionTypes'
import {
  HumanUserLoginClaims,
} from 'brain/security/claims'
import {User} from 'brain/user/human'

const initState = () => ({
  claims: new HumanUserLoginClaims(),

  party: {},
  partySet: false,

  user: new User(),
  userSet: false,

  loggedIn: false,
  loggedOut: false,
})

export default function auth(state = initState(), action) {
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
        partySet: true,
      }

    case setMyUser:
      return {
        ...state,
        user: action.data,
        userSet: true,
      }

    case login:
      return {
        ...state,
        loggedIn: true,
        loggedOut: false,
      }

    case logout:
      return {
        ...initState(),
        loggedOut: true,
      }

    default:
      return state
  }
}