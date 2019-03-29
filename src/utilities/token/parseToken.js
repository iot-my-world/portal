import {
  LoginClaims,
  RegisterCompanyAdminUserClaims,
  RegisterCompanyUserClaims,
  RegisterClientAdminUserClaims,
  RegisterClientUserClaims,
  ResetPasswordClaims,
} from 'brain/security/claims'
import {isString} from 'utilities/type/type'

export function parseToken(jwt) {
  if (!isString(jwt)) {
    throw new TypeError(`jwt given to parse token is not a string`)
  }

  if (jwt) {
    // Extract Claims Section of Token and parse json claims
    const payloadData = jwt.substring(jwt.indexOf('.') + 1,
        jwt.lastIndexOf('.'))
    const payloadString = atob(payloadData)
    const tokenPOJO = JSON.parse(payloadString)
    switch (tokenPOJO.type) {
      case LoginClaims.type:
        return new LoginClaims(tokenPOJO.value)

      case RegisterCompanyAdminUserClaims.type:
        return new RegisterCompanyAdminUserClaims(tokenPOJO.value)

      case RegisterCompanyUserClaims.type:
        return new RegisterCompanyUserClaims(tokenPOJO.value)

      case RegisterClientAdminUserClaims.type:
        return new RegisterClientAdminUserClaims(tokenPOJO.value)

      case RegisterClientUserClaims.type:
        return new RegisterClientUserClaims(tokenPOJO.value)

      case ResetPasswordClaims.type:
        return new ResetPasswordClaims(tokenPOJO.value)

      default:
        throw new TypeError(
            `invalid claims object type in token: ${tokenPOJO.type}`
        )
    }
  }
}