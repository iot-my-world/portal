import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import ClaimsBase from 'brain/security/claims/Base'
import {isObject} from 'utilities/type/index'
import {LoginClaimsType} from '../types'

class Login extends ClaimsBase {
  static type = LoginClaimsType

  /**
   * @type {IdIdentifier}
   * @private
   */
  _userId = new IdIdentifier()

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
   * construct a Login Object
   * @param {Login|Object} [login]
   */
  constructor(login) {
    super()
    if (
        (login !== undefined) &&
        (
            (login instanceof Login) ||
            isObject(login)
        )
    ) {
      try {
        this._userId = new IdIdentifier(login.userId)
        this._issueTime = login.issueTime
        this._expirationTime = login.expirationTime
        this._parentPartyType = login.parentPartyType
        this._parentId = new IdIdentifier(login.parentId)
        this._partyType = login.partyType
        this._partyId = new IdIdentifier(login.partyId)
      } catch (e) {
        throw new Error(`error constructing login object: ${e}`)
      }
    }
  }

  get userId() {
    return this._userId
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

  get partyType() {
    return this._partyType
  }

  get partyId() {
    return this._partyId
  }

  /**
   * Whether these login are expired or not
   * @returns {boolean}
   */
  get notExpired() {
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

  /**
   * returns milliseconds to expiry
   */
  get timeToExpiry() {
    return moment.unix(this._expirationTime)
        .utc()
        .diff(moment.utc(), 'seconds') * 1000
  }
}

export default Login