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
  _noSatellites = 0

  /**
   * @type {number}
   * @private
   */
  _latitude = 0

  /**
   * @type {number}
   * @private
   */
  _longitude = 0

  /**
   * @type {number}
   * @private
   */
  _speed = 0

  /**
   * @type {number}
   * @private
   */
  _heading = 0

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
        this._noSatellites = reading.noSatellites
        this._latitude = reading.latitude
        this._longitude = reading.longitude
        this._speed = reading.speed
        this._heading = reading.heading
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

  get noSatellites() {
    return this._noSatellites
  }

  set noSatellites(newVal) {
    this._noSatellites = newVal
  }

  get latitude() {
    return this._latitude
  }

  set latitude(newVal) {
    this._latitude = newVal
  }

  get longitude() {
    return this._longitude
  }

  set longitude(newVal) {
    this._longitude = newVal
  }

  get speed() {
    return this._speed
  }

  set speed(newVal) {
    this._speed = newVal
  }

  get heading() {
    return this._heading
  }

  set heading(newVal) {
    this._heading = newVal
  }

}
