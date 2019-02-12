import {Username as UsernameIdentifier} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import Base from 'brain/Base'

export default class Username extends Base {
  static identifierType = UsernameIdentifier

  /**
   * @type {string}
   * @private
   */
  _type = Username.identifierType

  /**
   * @type {{username: string}}
   * @private
   */
  _value = {
    username: '',
  }

  /**
   * construct a new username identifier
   * @param {string|Username|Object} [username]
   */
  constructor(username) {
    super()
    if (username !== undefined) {
      if (
          (username instanceof Username) ||
          (isObject(username))
      ) {
        this._value.username = username.username
      } else if (isString(username)) {
        this._value.username = username
      } else {
        throw new TypeError('invalid arg passed to Username identifier constructor')
      }
    }
  }

  get value() {
    return this._value
  }

  get username() {
    return this._value.username
  }
}