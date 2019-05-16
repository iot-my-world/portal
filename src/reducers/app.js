import {
  logout,
  showGlobalLoader,
  hideGlobalLoader,
} from 'actions/actionTypes'

const initState = () => ({
  showGlobalLoader: false,
})

export default function app(state = initState(), action) {
  switch (action.type) {
    case showGlobalLoader:
      return {
        ...state,
        showGlobalLoader: true,
      }

    case hideGlobalLoader:
      return {
        ...state,
        showGlobalLoader: false,
      }

    case logout:
      return initState()

    default:
      return state
  }
}