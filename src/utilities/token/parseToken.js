import {Claims} from 'brain/security/auth'

export function parseToken(jwt) {
  if (jwt === undefined) {
    throw new TypeError(`jwt given to parse token is undefined`)
  }
  if (jwt) {
    // Extract Claims Section of Token and parse json claims
    const payloadData = jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'))
    const payloadString = atob(payloadData)
    return new Claims(JSON.parse(payloadString))
  }
}