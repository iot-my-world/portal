import {
  appDoneLoading,
  setMaxViewDimensions,
} from 'actions/actionTypes'

/**
 * Called after log in or refresh to load the latest
 * view permissions into state
 * @returns {{type: number}}
 */
export function AppDoneLoading() {
  return {type: appDoneLoading}
}

/**
 * @param {{width: number, height: number}} maxDimensions
 * @returns {{type: number, data: {width: number, height: number}}}
 * @constructor
 */
export function SetMaxViewDimensions(maxDimensions) {
  return {type: setMaxViewDimensions, data: maxDimensions}
}