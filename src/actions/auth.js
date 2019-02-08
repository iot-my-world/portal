import {
  setClaims,
  logout,
} from 'actions/actionTypes'

/**
 * Called after a log in or refresh to load
 * latest claims into state
 * @param {Claims} claims
 * @returns {{type: number, data: Claims}}
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