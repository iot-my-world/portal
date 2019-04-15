import BaseCriterion from 'brain/search/criterion/Base'
import {TextCriterionType} from 'brain/search/criterion/types'
import {isObject} from 'utilities/type/index'

export default class Text extends BaseCriterion {
  static Type = TextCriterionType

  /**
   * @type {string}
   * @private
   */
  _field = ''

  /**
   * @type {string}
   * @private
   */
  _text = ''

  constructor(text) {
    super()
    try {
      if (
          (text !== undefined) &&
          (
              (text instanceof Text) ||
              isObject(text)
          )
      ) {
        this._text = text.text
        this._field = text.field
      }
    } catch (e) {
      throw new Error(`error constructing text criterion object: ${e}`)
    }
  }

  get field() {
    return this._field
  }

  set field(newVal) {
    this._field = newVal
  }

  get text() {
    return this._text
  }

  set text(newVal) {
    this._text = newVal
  }

  get blank() {
    return this._text === ''
  }

}