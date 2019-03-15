import {
  appDoneLoading,
  setMaxViewDimensions,
  logout,
} from 'actions/actionTypes'

const initState = () => ({
  doneLoading: false,
  maxViewDimensions: {
    width: 0,
    height: 0,
  },
})

export default function app(state = initState(), action) {
  switch (action.type) {
    case appDoneLoading:
      return {
        ...state,
        doneLoading: true,
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