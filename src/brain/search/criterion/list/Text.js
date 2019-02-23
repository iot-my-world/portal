import Base from 'brain/Base'
import {ListText as ListTextCriterion} from 'brain/search/criterion/types'
import {isObject} from 'utilities/type/index'

export default class ListText extends Base {
  static type = ListTextCriterion

  /**
   * @type {ListText}
   * @private
   */
  _type = ListText.type

  /**
   * @type {{field: string, list: []string}}
   * @private
   */
  _value = {
    field: '',
    list: [],
  }

  constructor(listText) {
    super()
    try {
      if (
          (listText !== undefined) &&
          (
              (listText instanceof ListText) ||
              isObject(listText)
          )
      ) {
        this._value.list = listText.list
        this._value.field = listText.field
      }
    } catch (e) {
      throw new Error(`error constructing listText criterion object: ${e}`)
    }
  }

  get type() {
    return this._type
  }

  get value() {
    return this._value
  }

  get field() {
    return this._value.field
  }

  set field(newVal) {
    this._value.field = newVal
  }

  get list() {
    return this._value.list
  }

  set list(newVal) {
    this._value.list = newVal
  }

  get blank() {
    return this._value.list.length === 0
  }

}