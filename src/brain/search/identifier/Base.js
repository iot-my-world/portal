import Base from 'brain/Base'

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

  toPOJO(){
    return this._value
  }

  toWrapped(){
    return super.toPOJO()
  }
}