import {
  setViewPermissions,
} from 'actions/actionTypes'

/**
 * Called after log in or refresh to load the latest
 * view permissions into state
 * @param {string[]} viewPermissions
 * @returns {{type: number, data: {string[]}}}
 * @constructor
 */
export function SetViewPermissions(viewPermissions) {
  return {type: setViewPermissions, data: viewPermissions}
}