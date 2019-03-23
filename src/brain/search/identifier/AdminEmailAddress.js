import {AdminEmailAddressIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class AdminEmailAddress extends BaseIdentifier {
  static identifierType = AdminEmailAddressIdentifierType

  /**
   * @type {string}
   * @private
   */
  _type = AdminEmailAddress.identifierType

  /**
   * @type {{adminEmailAddress: string}}
   * @private
   */
  _value = {
    adminEmailAddress: '',
  }

  /**
   * construct a new email address identifier
   * @param {string|AdminEmailAddress|Object} [adminEmailAddress]
   */
  constructor(adminEmailAddress) {
    super()
    if (adminEmailAddress !== undefined) {
      if (
          (adminEmailAddress instanceof AdminEmailAddress) ||
          (isObject(adminEmailAddress))
      ) {
        this._value.adminEmailAddress = adminEmailAddress.adminEmailAddress
      } else if (isString(adminEmailAddress)) {
        this._value.adminEmailAddress = adminEmailAddress
      } else {
        throw new TypeError('invalid arg passed to AdminEmailAddress identifier constructor')
      }
    }
  }

  get adminEmailAddress() {
    return this._value.adminEmailAddress
  }
}