import {UsernameIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Username extends BaseIdentifier {
  static identifierType = UsernameIdentifierType

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

  get username() {
    return this._value.username
  }
}