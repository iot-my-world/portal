import {Name as NameIdentifier} from 'brain/search/identifier/types'

export default class Name {
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
    name: ''
  }

  constructor(name){

  }

  get value(){
    return this._value
  }
}