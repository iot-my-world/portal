import BaseCriterion from 'brain/search/criterion/Base'
import {ListText as ListTextCriterion} from 'brain/search/criterion/types'
import {isObject} from 'utilities/type/index'

export default class ListText extends BaseCriterion {
  static Type = ListTextCriterion

  /**
   * @type {string}
   * @private
   */
  _field = ''
  
  /**
   * @type {string[]}
   * @private
   */
  _list = []

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
        this._list = listText.list
        this._field = listText.field
      }
    } catch (e) {
      throw new Error(`error constructing listText criterion object: ${e}`)
    }
  }

  get field() {
    return this._field
  }

  set field(newVal) {
    this._field = newVal
  }

  get list() {
    return this._list
  }

  set list(newVal) {
    this._list = newVal
  }

  get blank() {
    return this._list.length === 0
  }

}