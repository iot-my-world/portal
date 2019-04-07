import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export default class Barcode extends Base {
  /**
   * Barcode data
   * @type {string}
   * @private
   */
  _data = ''

  /**
   * construct a new Barcode Object
   * @param {Barcode|Object} [barcode]
   */
  constructor(barcode) {
    super()
    if (
        (barcode !== undefined) &&
        (
            (barcode instanceof Barcode) ||
            isObject(barcode)
        )
    ) {
      try {
        this._data = barcode.data
      } catch (e) {
        throw new Error(`error constructing barcode object: ${e}`)
      }
    }
  }

  get data() {
    return this._data
  }

  set data(newVal) {
    this._data = newVal
  }
}