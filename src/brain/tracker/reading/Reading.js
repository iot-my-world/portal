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
  _latitude = ''

  /**
   * @type {string}
   * @private
   */
  _longitute = ''

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
        this._latitude = reading.latitude
        this._longitute = reading.longitude
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

  get latitude() {
    return this._latitude
  }

  set latitude(newVal) {
    this._latitude = newVal
  }

  get longitude() {
    return this._longitute
  }

  set longitude(newVal) {
    this._longitute = newVal
  }

  get timeStamp() {
    return this._timeStamp
  }

  set timeStamp(newVal) {
    this._timeStamp = newVal
  }
}