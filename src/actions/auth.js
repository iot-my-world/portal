import {
  setClaims,
} from 'actions/actionTypes'

/**
 * @param {Claims} claims
 * @returns {{type: number, data: Claims}}
 * @constructor
 */
export function SetClaims(claims) {
  return {type: setClaims, data: claims}
}