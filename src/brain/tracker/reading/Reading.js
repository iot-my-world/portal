import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export default class Reading extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _imei = ''

  /**
   * @type {string}
   * @private
   */
  _raw = ''

  /**
   * @type {string}
   * @private
   */
  _southCoordinate = ''

  /**
   * @type {string}
   * @private
   */
  _eastCoordinate = ''

  /**
   * @type {number}
   * @private
   */
  _timeStamp = 0

  /**
   * construct a new Reading Object
   * @param {Reading|Object} [reading]
   */
  constructor(reading) {
    super()
    if (
        (reading !== undefined) &&
        (
            (reading instanceof Reading) ||
            isObject(reading)
        )
    ) {
      try {
        this._id = reading.id
        this._imei = reading.imei
        this._raw = reading.raw
        this._southCoordinate = reading.southCoordinate
        this._eastCoordinate = reading.eastCoordinate
        this._timeStamp = reading.timeStamp
      } catch (e) {
        throw new Error(`error constructing reading object: ${e}`)
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

  get raw() {
    return this._raw
  }

  set raw(newVal) {
    this._raw = newVal
  }

  get southCoordinate() {
    return this._southCoordinate
  }

  set southCoordinate(newVal) {
    this._southCoordinate = newVal
  }

  get eastCoordinate() {
    return this._eastCoordinate
  }

  set eastCoordinate(newVal) {
    this._eastCoordinate = newVal
  }

  get timeStamp() {
    return this._timeStamp
  }

  set timeStamp(newVal) {
    this._timeStamp = newVal
  }
}