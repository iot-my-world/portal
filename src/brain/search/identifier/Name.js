import {NameIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Name extends BaseIdentifier {
  static Type = NameIdentifierType

  /**
   * @type {string}
   * @private
   */
  _name = ''

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
        this._name = name.name
      } else if (isString(name)) {
        this._name = name
      } else {
        throw new TypeError('invalid arg passed to Name identifier constructor')
      }
    }
  }

  get name() {
    return this._name
  }
}