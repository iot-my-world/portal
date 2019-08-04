import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export default class Message extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {number}
   * @private
   */
  _timeStamp = 0

  /**
   * @type {string}
   * @private
   */
  _deviceId = ''

  /**
   * @type {Array}
   * @private
   */
  _data = []

  /**
   * construct a new Message Object
   * @param {Message|Object} [message]
   */
  constructor(message) {
    super()
    if (message !== undefined &&
      (message instanceof Message || isObject(message))) {
      try {
        this._id = message.id
        this._timeStamp = message.timeStamp
        this._deviceId = message.deviceId
        this._data = message.data
      } catch (e) {
        throw new Error('error constructing new message object: ' + e)
      }
    }
  }

  get id() {
    return this._id
  }

  get timeStamp() {
    return this._timeStamp
  }

  get deviceId() {
    return this._deviceId
  }

  get data() {
    return this._data
  }
}