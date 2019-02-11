import {EmailAddress as EmailAddressIdentifier} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import Base from 'brain/Base'

export default class EmailAddress extends Base {
  static identifierType = EmailAddressIdentifier

  /**
   * @type {string}
   * @private
   */
  _type = EmailAddress.identifierType

  /**
   * @type {{emailAddress: string}}
   * @private
   */
  _value = {
    emailAddress: '',
  }

  /**
   * construct a new email address identifier
   * @param {string|EmailAddress|Object} [emailAddress]
   */
  constructor(emailAddress) {
    super()
    if (emailAddress !== undefined) {
      if (
          (emailAddress instanceof EmailAddress) ||
          (isObject(emailAddress))
      ) {
        this._value.emailAddress = emailAddress.emailAddress
      } else if (isString(emailAddress)) {
        this._value.emailAddress = emailAddress
      } else {
        throw new TypeError('invalid arg passed to EmailAddress identifier constructor')
      }
    }
  }

  get value() {
    return this._value
  }

  get emailAddress() {
    return this._value.emailAddress
  }
}