import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {IdIdentifier} from 'brain/search/identifier/index'

export default class SF001 extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _deviceId = ''

  /**
   * @type {string}
   * @private
   */
  _ownerPartyType = ''

  /**
   * @type {Id}
   * @private
   */
  _ownerId = new IdIdentifier()

  /**
   * @type {string}
   * @private
   */
  _assignedPartyType = ''

  /**
   * @type {Id}
   * @private
   */
  _assignedId = new IdIdentifier()

  /**
   * @type {number}
   * @private
   */
  _lastMessageTimestamp = 0

  /**
   * construct a new SF001 Object
   * @param {SF001|Object} [sf001]
   */
  constructor(sf001) {
    super()
    if (sf001 !== undefined && (sf001 instanceof SF001 || isObject(sf001))) {
      try {
        this._id = sf001.id
        this._deviceId = sf001.deviceId
        this._ownerPartyType = sf001.ownerPartyType
        this._ownerId = new IdIdentifier(sf001.ownerId)
        this._assignedPartyType = sf001.assignedPartyType
        this._assignedId = new IdIdentifier(sf001.assignedId)
        this._lastMessageTimestamp = sf001.lastMessageTimestamp
      } catch (e) {
        throw new Error(`error constructing sf001 object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get deviceId() {
    return this._deviceId
  }

  set deviceId(newVal) {
    this._deviceId = newVal
  }

  get ownerPartyType() {
    return this._ownerPartyType
  }

  set ownerPartyType(newVal) {
    this._ownerPartyType = newVal
  }

  get ownerId() {
    return this._ownerId
  }

  set ownerId(newVal) {
    this._ownerId = newVal
  }

  get assignedPartyType() {
    return this._assignedPartyType
  }

  set assignedPartyType(newVal) {
    this._assignedPartyType = newVal
  }

  get assignedId() {
    return this._assignedId
  }

  set assignedId(newVal) {
    this._assignedId = newVal
  }

  get lastMessageTimestamp() {
    return this._lastMessageTimestamp
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else {
      throw new Error(`cannot create identifier for sf001 if id is blank`)
    }
  }
}
