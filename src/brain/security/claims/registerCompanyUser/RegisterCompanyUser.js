import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterCompanyUser as RegisterCompanyUserClaimsType} from 'brain/security/claims/types'
import {User} from 'brain/party/user/index'

class RegisterCompanyUser extends ClaimsBase {
  static type = RegisterCompanyUserClaimsType

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
   * construct a RegisterCompanyUserClaims Object
   * @param {RegisterCompanyUser|Object} [registerCompanyUserClaims]
   */
  constructor(registerCompanyUserClaims) {
    super()
    if (
        (registerCompanyUserClaims !== undefined) &&
        (
            (registerCompanyUserClaims instanceof
                RegisterCompanyUser) ||
            isObject(registerCompanyUserClaims)
        )
    ) {
      try {
        this._issueTime = registerCompanyUserClaims.issueTime
        this._expirationTime = registerCompanyUserClaims.expirationTime
        this._parentPartyType = registerCompanyUserClaims.parentPartyType
        this._parentId =
            new IdIdentifier(registerCompanyUserClaims.parentId)
        this._partyType = registerCompanyUserClaims.partyType
        this._partyId = new IdIdentifier(registerCompanyUserClaims.partyId)
        this._user = new User(registerCompanyUserClaims.user)
      } catch (e) {
        throw new Error(
            `error constructing registerCompanyUserClaims object: ${e}`)
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
   * Whether these registerCompanyUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterCompanyUser