import {toast} from 'react-toastify'
import {
  notificationSuccess,
  notificationFailure,
  logout,
} from 'actions/actionTypes'

const initState = () => ({})

export default function notification(state = initState(), action) {
  switch (action.type) {
    case notificationSuccess:
      toast.success(action.data)
      return state

    case notificationFailure:
      toast.error(action.data)
      return state

    case logout:
      return initState()

    default:
      return state
  }
}