import {Claims} from 'brain/security/auth'
import {isString} from 'utilities/type/type'

export function parseToken(jwt) {
  if (!isString(jwt)) {
    throw new TypeError(`jwt given to parse token is not a string`)
  }

  if (jwt) {
    // Extract Claims Section of Token and parse json claims
    const payloadData = jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))
    const payloadString = atob(payloadData)
    return new Claims(JSON.parse(payloadString))
  }
}