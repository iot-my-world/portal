import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterClientAdminUser as RegisterClientAdminUserClaimsType} from 'brain/security/claims/types'
import {User} from 'brain/party/user/index'

class RegisterClientAdminUser extends ClaimsBase {
  static type = RegisterClientAdminUserClaimsType

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
   * construct a RegisterClientAdminUserClaims Object
   * @param {RegisterClientAdminUser|Object} [registerClientAdminUserClaims]
   */
  constructor(registerClientAdminUserClaims) {
    super()
    if (
        (registerClientAdminUserClaims !== undefined) &&
        (
            (registerClientAdminUserClaims instanceof
                RegisterClientAdminUser) ||
            isObject(registerClientAdminUserClaims)
        )
    ) {
      try {
        this._issueTime = registerClientAdminUserClaims.issueTime
        this._expirationTime = registerClientAdminUserClaims.expirationTime
        this._parentPartyType = registerClientAdminUserClaims.parentPartyType
        this._parentId = new IdIdentifier(
            registerClientAdminUserClaims.parentId)
        this._partyType = registerClientAdminUserClaims.partyType
        this._partyId = new IdIdentifier(registerClientAdminUserClaims.partyId)
        this._user = new User(registerClientAdminUserClaims.user)
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
   * Whether these registerClientAdminUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterClientAdminUser