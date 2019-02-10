import {Name as NameIdentifier} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import Base from 'brain/Base'

export default class Name extends Base {
  static identifierType = NameIdentifier

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

  get value() {
    return this._value
  }

  get name() {
    return this._value.name
  }
}