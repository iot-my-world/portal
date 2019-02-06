import {Id as IdIdentifier} from 'brain/search/identifier'
import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

class Claims extends Base {
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
   * construct a Claims Object
   * @param {Claims|Object} [claims]
   */
  constructor(claims) {
    super()
    if (
        (claims !== undefined) &&
        (
            (claims instanceof Claims) ||
            isObject(claims)
        )
    ) {
      console.log('using this!', claims)
      try {
        this._userId = new IdIdentifier(claims.userId)
        this._issueTime = claims.issueTime
        this._expirationTime = claims.expirationTime
        this._partyType = claims.partyType
        this._partyId = new IdIdentifier(claims.partyId)
      } catch (e) {
        console.error(`error constructing claims object: ${e}`)
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

}

export default Claims