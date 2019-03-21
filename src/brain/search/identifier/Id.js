import {IdIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Id extends BaseIdentifier {
  static identifierType = IdIdentifierType

  /**
   * @type {string}
   * @private
   */
  _type = Id.identifierType

  /**
   * @type {{id: string}}
   * @private
   */
  _value = {
    id: '',
  }

  /**
   * construct a new id identifier
   * @param {string|Id|Object} [id]
   */
  constructor(id) {
    super()
    if (id !== undefined) {
      if (
          (id instanceof Id) ||
          (isObject(id))
      ) {
        this._value.id = id.id
      } else if (isString(id)) {
        this._value.id = id
      } else {
        throw new TypeError('invalid arg passed to Id identifier constructor')
      }
    }
  }

  get id() {
    return this._value.id
  }
}