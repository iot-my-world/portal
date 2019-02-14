import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/auth/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterCompanyAdminUser} from 'brain/security/auth/claims/types'

class RegisterCompanyAdminUserClaims extends ClaimsBase {
  static type = RegisterCompanyAdminUser

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
   * construct a RegisterCompanyAdminUserClaims Object
   * @param {RegisterCompanyAdminUserClaims|Object} [registerCompanyAdminUserClaims]
   */
  constructor(registerCompanyAdminUserClaims) {
    super()
    if (
        (registerCompanyAdminUserClaims !== undefined) &&
        (
            (registerCompanyAdminUserClaims instanceof
                RegisterCompanyAdminUserClaims) ||
            isObject(registerCompanyAdminUserClaims)
        )
    ) {
      try {
        this._issueTime = registerCompanyAdminUserClaims.issueTime
        this._expirationTime = registerCompanyAdminUserClaims.expirationTime
        this._partyId = new IdIdentifier(registerCompanyAdminUserClaims.partyId)
        this._partyType = registerCompanyAdminUserClaims.partyType
        this._emailAddress = registerCompanyAdminUserClaims.emailAddress
      } catch (e) {
        throw new Error(
            `error constructing registerCompanyAdminUserClaims object: ${e}`)
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
   * Whether these registerCompanyAdminUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterCompanyAdminUserClaims