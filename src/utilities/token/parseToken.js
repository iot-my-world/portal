import {
  LoginClaims,
  RegisterCompanyAdminUserClaims,
  RegisterCompanyUserClaims,
  RegisterClientAdminUserClaims,
  RegisterClientUserClaims,
} from 'brain/security/claims/index'
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
    console.log('token pojo', tokenPOJO)
    switch (tokenPOJO.type) {
      case LoginClaims.type:
        console.log('this type!!!! login')
        return new LoginClaims(tokenPOJO.value)

      case RegisterCompanyAdminUserClaims.type:
        console.log('this type!')
        return new RegisterCompanyAdminUserClaims(tokenPOJO.value)

      case RegisterCompanyUserClaims.type:
        return new RegisterCompanyUserClaims(tokenPOJO.value)

      case RegisterClientAdminUserClaims.type:
        return new RegisterClientAdminUserClaims(tokenPOJO.value)

      case RegisterClientUserClaims.type:
        return new RegisterClientUserClaims(tokenPOJO.value)

      default:
        throw new TypeError(
            `invalid claims object type in token: ${tokenPOJO.type}`
        )
    }
  }
}