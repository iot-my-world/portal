import {isObject} from 'utilities/type/index'

export default class ReasonInvalid {
  /**
   * @type {string}
   * @private
   */
  _field = ''

  /**
   * @type {string}
   * @private
   */
  _type = ''

  /**
   * @type {string}
   * @private
   */
  _help = ''

  /**
   * @type {*}
   * @private
   */
  _data

  /**
   * construct a new ReasonInvalid Object
   * @param {ReasonInvalid|Object} [reasonInvalid]
   */
  constructor(reasonInvalid) {
    if (
        (reasonInvalid !== undefined) &&
        (
            (reasonInvalid instanceof ReasonInvalid) ||
            isObject(reasonInvalid)
        )
    ) {
      try {
        this._field = reasonInvalid.field
        this._type = reasonInvalid.type
        this._help = reasonInvalid.help
        this._data = reasonInvalid.data
      } catch (e) {
        throw new Error(`error constructing reasonInvalid object: ${e}`)
      }
    }
  }

  get field(){
    return this._field
  }

  get type(){
    return this._type
  }

  get help(){
    return this._help
  }

  get data(){
    return this._data
  }
  
}