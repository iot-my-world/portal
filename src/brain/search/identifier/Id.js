import {IdIdentifierType} from 'brain/search/identifier/types'
import {isObject, isString} from 'utilities/type'
import BaseIdentifier from './Base'

export default class Id extends BaseIdentifier {
  static Type = IdIdentifierType

  /**
   * @type {string}
   * @private
   */
  _id = ''

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
        this._id = id.id
      } else if (isString(id)) {
        this._id = id
      } else {
        throw new TypeError('invalid arg passed to Id identifier constructor')
      }
    }
  }

  get id() {
    return this._id
  }
}