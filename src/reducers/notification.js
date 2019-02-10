import {toast} from 'react-toastify'
import {
  notificationSuccess,
  notificationFailure,
} from 'actions/actionTypes'

const initState = {}

export default function notification(state = initState, action) {
  switch (action.type) {
    case notificationSuccess:
      toast.success(action.data)
      return state

    case notificationFailure:
      toast.error(action.data)
      return state
    default:
      return state
  }
}