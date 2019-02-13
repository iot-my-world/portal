import {Id as IdIdentifier} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import Base from 'brain/Base'

export default class Id extends Base {
  static identifierType = IdIdentifier

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

  get value() {
    return this._value
  }

  get id() {
    return this._value.id
  }

  toPOJO(){
    return this._value
  }
}