import {
  appDoneLoading,
  setMaxViewDimensions,
  logout,
  showGlobalLoader,
  hideGlobalLoader,
} from 'actions/actionTypes'

const initState = () => ({
  doneLoading: false,
  maxViewDimensions: {
    width: 0,
    height: 0,
  },
  showGlobalLoader: false,
})

export default function app(state = initState(), action) {
  switch (action.type) {
    case appDoneLoading:
      return {
        ...state,
        doneLoading: true,
      }

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

    case setMaxViewDimensions:
      return {
        ...state,
        maxViewDimensions: action.data,
      }

    case logout:
      return initState()

    default:
      return state
  }
}