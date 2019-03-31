import Base from 'brain/Base'
import {OrCriterionType} from 'brain/search/criterion/types'
import {isObject} from 'utilities/type/index'

export default class Or extends Base {
  static type = OrCriterionType

  /**
   * @type {Or}
   * @private
   */
  _type = Or.type

  /**
   *  list of criteria to be combined with or
   * @type {{criteria: Array}}
   * @private
   */
  _value = {
    criteria: [],
  }

  constructor(text) {
    super()
    try {
      if (
          (text !== undefined) &&
          (
              (text instanceof Or) ||
              isObject(text)
          )
      ) {
        this._value.criteria = text.criteria
      }
    } catch (e) {
      throw new Error(`error constructing text criterion object: ${e}`)
    }
  }

  get type() {
    return this._type
  }

  get value() {
    return this._value
  }

  get criteria() {
    return this._value.criteria
  }

  set criteria(newVal) {
    this._value.criteria = newVal
  }

  get blank() {
    return this._value.criteria.length === 0
  }

  toPOJO(){
    let retObj = super.toPOJO()
    retObj.value.criteria = this._value.criteria.map(crit => crit.toPOJO())
    return retObj
  }

}