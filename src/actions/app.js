import {
  showGlobalLoader,
  hideGlobalLoader,
} from 'actions/actionTypes'

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