import {AdminEmailAddress as AdminEmailAddressIdentifier} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import Base from 'brain/Base'

export default class AdminEmailAddress extends Base {
  static identifierType = AdminEmailAddressIdentifier

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

  get value() {
    return this._value
  }

  get adminEmailAddress() {
    return this._value.adminEmailAddress
  }
}