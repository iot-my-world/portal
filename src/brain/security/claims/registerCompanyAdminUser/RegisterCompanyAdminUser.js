import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterCompanyAdminUserClaimsType} from 'brain/security/claims/types'
import {User} from 'brain/user/human/index'

class RegisterCompanyAdminUser extends ClaimsBase {
  static type = RegisterCompanyAdminUserClaimsType

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
   * @type {string}
   * @private
   */
  _parentPartyType = ''

  /**
   * @type {IdIdentifier}
   * @private
   */
  _parentId = new IdIdentifier()

  /**
   * @type {string}
   * @private
   */
  _partyType = ''

  /**
   * @type {IdIdentifier}
   * @private
   */
  _partyId = new IdIdentifier()

  /**
   * @type {User}
   * @private
   */
  _user = new User()

  /**
   * construct a RegisterCompanyAdminUserClaims Object
   * @param {RegisterCompanyAdminUser|Object} [registerCompanyAdminUserClaims]
   */
  constructor(registerCompanyAdminUserClaims) {
    super()
    if (
        (registerCompanyAdminUserClaims !== undefined) &&
        (
            (registerCompanyAdminUserClaims instanceof
                RegisterCompanyAdminUser) ||
            isObject(registerCompanyAdminUserClaims)
        )
    ) {
      try {
        this._issueTime = registerCompanyAdminUserClaims.issueTime
        this._expirationTime = registerCompanyAdminUserClaims.expirationTime
        this._parentPartyType = registerCompanyAdminUserClaims.parentPartyType
        this._parentId =
            new IdIdentifier(registerCompanyAdminUserClaims.parentId)
        this._partyType = registerCompanyAdminUserClaims.partyType
        this._partyId = new IdIdentifier(registerCompanyAdminUserClaims.partyId)
        this._user = new User(registerCompanyAdminUserClaims.user)
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

  get parentPartyType() {
    return this._parentPartyType
  }

  get parentId() {
    return this._parentId
  }

  get partyId() {
    return this._partyId
  }

  get partyType() {
    return this._partyType
  }

  get user() {
    return this._user
  }

  /**
   * Whether these registerCompanyAdminUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterCompanyAdminUser