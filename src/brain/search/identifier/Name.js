import {NameIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Name extends BaseIdentifier {
  static identifierType = NameIdentifierType

  /**
   * @type {string}
   * @private
   */
  _type = Name.identifierType

  /**
   * @type {{name: string}}
   * @private
   */
  _value = {
    name: '',
  }

  /**
   * construct a new name identifier
   * @param {string|Name|Object} [name]
   */
  constructor(name) {
    super()
    if (name !== undefined) {
      if (
          (name instanceof Name) ||
          (isObject(name))
      ) {
        this._value.name = name.name
      } else if (isString(name)) {
        this._value.name = name
      } else {
        throw new TypeError('invalid arg passed to Name identifier constructor')
      }
    }
  }

  get name() {
    return this._value.name
  }
}