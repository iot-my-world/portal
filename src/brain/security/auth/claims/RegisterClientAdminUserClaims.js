import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/auth/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterClientAdminUser} from 'brain/security/auth/claims/types'

class RegisterClientAdminUserClaims extends ClaimsBase {
  static type = RegisterClientAdminUser

  /**
   * @type {number}
   * @private
   */
  _issueTime = 0

  /**
   * @type {number}
   * @private
   */
  _expirationTime = 0

  /**
   * @type {IdIdentifier}
   * @private
   */
  _partyId = new IdIdentifier()

  /**
   * @type {string}
   * @private
   */
  _partyType = ''

  /**
   * @type {string}
   * @private
   */
  _emailAddress = ''

  /**
   * construct a RegisterClientAdminUserClaims Object
   * @param {RegisterClientAdminUserClaims|Object} [registerClientAdminUserClaims]
   */
  constructor(registerClientAdminUserClaims) {
    super()
    if (
        (registerClientAdminUserClaims !== undefined) &&
        (
            (registerClientAdminUserClaims instanceof
                RegisterClientAdminUserClaims) ||
            isObject(registerClientAdminUserClaims)
        )
    ) {
      try {
        this._issueTime = registerClientAdminUserClaims.issueTime
        this._expirationTime = registerClientAdminUserClaims.expirationTime
        this._partyId = new IdIdentifier(registerClientAdminUserClaims.partyId)
        this._partyType = registerClientAdminUserClaims.partyType
        this._emailAddress = registerClientAdminUserClaims.emailAddress
      } catch (e) {
        throw new Error(
            `error constructing registerClientAdminUserClaims object: ${e}`)
      }
    }
  }

  get issueTime() {
    return this._issueTime
  }

  get expirationTime() {
    return this._expirationTime
  }

  get partyId() {
    return this._partyId
  }

  get partyType(){
    return this._partyType
  }

  get emailAddress(){
    return this._emailAddress
  }

  /**
   * Whether these registerClientAdminUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterClientAdminUserClaims