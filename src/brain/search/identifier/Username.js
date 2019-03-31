import {UsernameIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Username extends BaseIdentifier {
  static Type = UsernameIdentifierType

  /**
   * @type {string}
   * @private
   */
  _username = ''

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
        this._username = username.username
      } else if (isString(username)) {
        this._username = username
      } else {
        throw new TypeError('invalid arg passed to Username identifier constructor')
      }
    }
  }

  get username() {
    return this._username
  }
}