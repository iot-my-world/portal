import {
  logout,
  showGlobalLoader,
  hideGlobalLoader, routeBuildingDone,
} from 'actions/actionTypes'

const initState = () => ({
  showGlobalLoader: false,
  routeBuildingDone: false,
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

    case routeBuildingDone:
      return {
        ...state,
        routeBuildingDone: true,
      }

    case logout:
      return initState()

    default:
      return state
  }
}