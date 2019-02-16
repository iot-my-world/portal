import {
  appDoneLoading,
} from 'actions/actionTypes'

/**
 * Called after log in or refresh to load the latest
 * view permissions into state
 * @returns {{type: number}}
 * @constructor
 */
export function AppDoneLoading() {
  return {type: appDoneLoading}
}