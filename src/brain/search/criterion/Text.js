import Base from 'brain/Base'
import {Text as TextCriterion} from 'brain/search/criterion/types'
import {isObject} from 'utilities/type/index'

export default class Text extends Base {
  static type = TextCriterion

  /**
   * @type {Text}
   * @private
   */
  _type = Text.type

  /**
   * @type {{field: string, text: string}}
   * @private
   */
  _value = {
    field: '',
    text: '',
  }

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
        this._value.text = text.text
        this._value.field = text.field
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

  get field() {
    return this._value.field
  }

  set field(newVal) {
    this._value.field = newVal
  }

  get text() {
    return this._value.text
  }

  set text(newVal) {
    this._value.text = newVal
  }

  get blank() {
    return this._value.text === ''
  }

}