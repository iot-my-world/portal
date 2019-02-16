import {
  setClaims,
  logout,
  setViewPermissions,
} from 'actions/actionTypes'

/**
 * Called after a log in or refresh to load
 * latest claims into state
 * @param {LoginClaims} claims
 * @returns {{type: number, data: LoginClaims}}
 * @constructor
 */
export function SetClaims(claims) {
  return {type: setClaims, data: claims}
}

/**
 *  * Called after log in or refresh to load the latest
 * view permissions into state
 * @param {string[]} viewPermissions
 * @returns {{type: number, data: {string[]}}}
 * @constructor
 */
export function SetViewPermissions(viewPermissions) {
  return {type: setViewPermissions, data: viewPermissions}
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