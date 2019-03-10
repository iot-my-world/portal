import {
  setClaims,
  logout, setMyParty,
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
 * Called to set my party in state
 * @param party
 * @returns {{type: number, data: *}}
 * @constructor
 */
export function SetMyParty(party) {
  return {type: setMyParty, data: party}
}