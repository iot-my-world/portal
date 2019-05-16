import {
  setViewPermissions,
  logout,
} from 'actions/actionTypes'

const initState = () => ({
  viewPermissionsSet: false,
  view: [],
})

export default function permission(state = initState(), action) {
  switch (action.type) {
    case setViewPermissions:
      return {
        ...state,
        view: action.data,
        viewPermissionsSet: true,
      }

    case logout:
      return initState()

    default:
      return state
  }
}