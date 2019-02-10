import {
  notificationSuccess, notificationFailure,
} from 'actions/actionTypes'

export function NotificationSuccess(successMessage) {
  return {type: notificationSuccess, data: successMessage}
}

export function NotificationFailure(failureMessage) {
  return {type: notificationFailure, data: failureMessage}
}