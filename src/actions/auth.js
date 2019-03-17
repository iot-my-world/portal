import {
  setClaims,
  logout, login,
  setMyParty, setMyUser,
} from 'actions/actionTypes'

/**
 * Called after a log in or refresh to load
 * latest claims into state
 * @param {Login} claims
 * @returns {{type: number, data: Login}}
 * @constructor
 */
export function SetClaims(claims) {
  return {type: setClaims, data: claims}
}

/**
 * Called on logout to trigger
 * state reset
 * @returns {{type: number}}
 * @constructor
 */
export function Logout() {
  return {type: logout}
}

/**
 * Called on login
 * @returns {{type: number}}
 * @constructor
 */
export function Login() {
  return {type: login}
}

/**
 * Called to set my party in state
 * @param party
 * @returns {{type: number, data: *}}
 * @constructor
 */
export function SetMyParty(party) {
  return {type: setMyParty, data: party}
}

/**
 * Called to set my user in state
 * @param {User} user
 * @returns {{type: number, data: *}}
 * @constructor
 */
export function SetMyUser(user) {
  return {type: setMyUser, data: user}
}