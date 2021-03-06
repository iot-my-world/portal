import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/claims/Base'
import {isObject} from 'utilities/type/index'
import {RegisterClientUserClaimsType} from 'brain/security/claims/types'
import {User} from 'brain/user/human/index'

class RegisterClientUser extends ClaimsBase {
  static type = RegisterClientUserClaimsType

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
   * construct a RegisterClientUserClaims Object
   * @param {RegisterClientUser|Object} [registerClientUserClaims]
   */
  constructor(registerClientUserClaims) {
    super()
    if (
        (registerClientUserClaims !== undefined) &&
        (
            (registerClientUserClaims instanceof
                RegisterClientUser) ||
            isObject(registerClientUserClaims)
        )
    ) {
      try {
        this._issueTime = registerClientUserClaims.issueTime
        this._expirationTime = registerClientUserClaims.expirationTime
        this._parentPartyType = registerClientUserClaims.parentPartyType
        this._parentId = new IdIdentifier(registerClientUserClaims.parentId)
        this._partyType = registerClientUserClaims.partyType
        this._partyId = new IdIdentifier(registerClientUserClaims.partyId)
        this._user = new User(registerClientUserClaims.user)
      } catch (e) {
        throw new Error(
            `error constructing registerClientUserClaims object: ${e}`)
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
   * Whether these registerClientUserClaims are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default RegisterClientUser