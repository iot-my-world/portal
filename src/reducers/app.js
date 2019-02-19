import {
  appDoneLoading,
  logout,
} from 'actions/actionTypes'

const initState = {
  doneLoading: false,
}

export default function app(state = initState, action) {
  switch (action.type) {
    case appDoneLoading:
      return {
        ...state,
        doneLoading: true,
      }

    case logout:
      return initState

    default:
      return state
  }
}