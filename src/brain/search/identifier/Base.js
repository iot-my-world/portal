import Base from 'brain/Base'
import {isFunction} from 'utilities/type/index'

export default class BaseIdentifier extends Base {
  /**
   * @type {string}
   * @private
   */
  _type = 'BASE_override_in_Child'

  /**
   * @type {{}}
   * @private
   */
  _value = {}


  get value() {
    return this._value
  }

  get type() {
    return this._type
  }

  unwrappedPOJO() {
    let retObj = {}
    // for each field on this object
    Object.keys(this._value).forEach(field => {
      if (
          // if the data at the field is not undefined or null
          !(
              (this._value[field] === undefined) ||
              (this._value[field] === null)
          ) &&
          // and the data at the field has a forPost method
          (isFunction(this._value[field].unwrappedPOJO))
      ) {
        // then set the field equal to it's forPost output
        retObj[field] = this._value[field].unwrappedPOJO()
      } else {
        // otherwise, parse the data at the field if the field is listed in
        retObj[field] = this._value[field]
      }
    })
    return retObj
  }
}