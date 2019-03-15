import {
  setViewPermissions,
  logout,
} from 'actions/actionTypes'

const initState = () => ({
  view: [],
})

export default function permission(state = initState(), action) {
  switch (action.type) {
    case setViewPermissions:
      return {
        ...state,
        view: action.data,
      }

    case logout:
      return initState()

    default:
      return state
  }
}