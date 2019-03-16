import {
  appDoneLoading,
  setMaxViewDimensions,
  showGlobalLoader,
  hideGlobalLoader,
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
 * Called to open global loading component
 * @returns {{type: number}}
 */
export function ShowGlobalLoader() {
  return {type: showGlobalLoader}
}

/**
 * Called to hide global loading component
 * @returns {{type: number}}
 */
export function HideGlobalLoader() {
  return {type: hideGlobalLoader}
}

/**
 * @param {{width: number, height: number}} maxDimensions
 * @returns {{type: number, data: {width: number, height: number}}}
 */
export function SetMaxViewDimensions(maxDimensions) {
  return {type: setMaxViewDimensions, data: maxDimensions}
}