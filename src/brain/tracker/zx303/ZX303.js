import BaseDevice from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {IdIdentifier} from 'brain/search/identifier/index'
import {ZX303DeviceType} from 'brain/tracker/types'

export default class ZX303 extends BaseDevice {
  static Type = ZX303DeviceType

  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _type = ZX303DeviceType

  /**
   * @type {string}
   * @private
   */
  _imei = ''

  /**
   * @type {string}
   * @private
   */
  _simCountryCode = ''

  /**
   * @type {string}
   * @private
   */
  _simNumber = ''

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
   * @type {boolean}
   * @private
   */
  _loggedIn = false

  /**
   * @type {number}
   * @private
   */
  _logInTimestamp = 0

  /**
   * @type {number}
   * @private
   */
  _logOutTimestamp = 0

  /**
   * @type {number}
   * @private
   */
  _lastHeartbeatTimestamp = 0

  /**
   * construct a new ZX303 Object
   * @param {ZX303|Object} [zx303]
   */
  constructor(zx303) {
    super()
    if (zx303 !== undefined && (zx303 instanceof ZX303 || isObject(zx303))) {
      try {
        this._id = zx303.id
        this._imei = zx303.imei
        this._simCountryCode = zx303.simCountryCode
        this._simNumber = zx303.simNumber
        this._ownerPartyType = zx303.ownerPartyType
        this._ownerId = new IdIdentifier(zx303.ownerId)
        this._assignedPartyType = zx303.assignedPartyType
        this._assignedId = new IdIdentifier(zx303.assignedId)
        this._loggedIn = zx303.loggedIn
        this._logInTimestamp = zx303.logInTimestamp
        this._logOutTimestamp = zx303.logOutTimestamp
        this._lastHeartbeatTimestamp = zx303.lastHeartbeatTimestamp
      } catch (e) {
        throw new Error(`error constructing zx303 object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get imei() {
    return this._imei
  }

  set imei(newVal) {
    this._imei = newVal
  }

  get simCountryCode() {
    return this._simCountryCode
  }

  set simCountryCode(newVal) {
    this._simCountryCode = newVal
  }

  get simNumber() {
    return this._simNumber
  }

  set simNumber(newVal) {
    this._simNumber = newVal
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

  get loggedIn() {
    return this._loggedIn
  }

  get logInTimestamp() {
    return this._logInTimestamp
  }

  get logOutTimestamp() {
    return this._logOutTimestamp
  }

  get lastHeartbeatTimestamp() {
    return this._lastHeartbeatTimestamp
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else {
      throw new Error(`cannot create identifier for zx303 if id is blank`)
    }
  }
}
