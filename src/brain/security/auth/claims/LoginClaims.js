import moment from 'moment'
import {IdIdentifier} from 'brain/search/identifier/index'
import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

class LoginClaims extends Base {
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
  _partyType = ''

  /**
   * @type {IdIdentifier}
   * @private
   */
  _partyId = new IdIdentifier()

  /**
   * construct a LoginClaims Object
   * @param {LoginClaims|Object} [loginClaims]
   */
  constructor(loginClaims) {
    super()
    if (
        (loginClaims !== undefined) &&
        (
            (loginClaims instanceof LoginClaims) ||
            isObject(loginClaims)
        )
    ) {
      try {
        this._userId = new IdIdentifier(loginClaims.userId)
        this._issueTime = loginClaims.issueTime
        this._expirationTime = loginClaims.expirationTime
        this._partyType = loginClaims.partyType
        this._partyId = new IdIdentifier(loginClaims.partyId)
      } catch (e) {
        throw new Error(`error constructing loginClaims object: ${e}`)
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

  get partyType() {
    return this._partyType
  }

  get partyId() {
    return this._partyId
  }

  /**
   * Whether these loginClaims are expired or not
   * @returns {boolean}
   */
  get notExpired(){
    return moment.utc().isBefore(moment.unix(this._expirationTime).utc())
  }

}

export default LoginClaims