import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import IdIdentifier from 'brain/search/identifier/Id'

export default class Reading extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {Id}
   * @private
   */
  _deviceId = new IdIdentifier()

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
  _timeStamp = 0

  /**
   * @type {number}
   * @private
   */
  _batteryPercentage = 0

  /**
   * @type {number}
   * @private
   */
  _uploadInterval = 0

  /**
   * @type {number}
   * @private
   */
  _softwareVersion = 0

  /**
   * @type {number}
   * @private
   */
  _timezone = 0

  /**
   * construct a new Reading Object
   * @param {Reading|Object} [reading]
   */
  constructor(reading) {
    super()
    if (
        reading !== undefined &&
        (reading instanceof Reading || isObject(reading))
    ) {
      try {
        this._id = reading.id
        this._deviceId = new IdIdentifier(reading.deviceId)
        this._ownerPartyType = reading.ownerPartyType
        this._ownerId = new IdIdentifier(reading.ownerId)
        this._assignedPartyType = reading.assignedPartyType
        this._assignedId = new IdIdentifier(reading.assignedId)
        this._timeStamp = reading.timeStamp
        this._batteryPercentage = reading.batteryPercentage
        this._uploadInterval = reading.uploadInterval
        this._softwareVersion = reading.softwareVersion
      } catch (e) {
        throw new Error(`error constructing zx303 tracker reading object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }
  // cannot set id

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

  get timeStamp() {
    return this._timeStamp
  }

  set timeStamp(newVal) {
    this._timeStamp = newVal
  }

  get batteryPercentage() {
    return this._batteryPercentage
  }

  set batteryPercentage(newVal) {
    this._batteryPercentage = newVal
  }

  get uploadInterval() {
    return this._uploadInterval
  }

  set uploadInterval(newVal) {
    this._uploadInterval = newVal
  }

  get softwareVersion() {
    return this._softwareVersion
  }

  set softwareVersion(newVal) {
    this._softwareVersion = newVal
  }

  get timezone() {
    return this._timezone
  }

  set timezone(newVal) {
    this._timezone = newVal
  }
}
