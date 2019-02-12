import {isObject} from 'utilities/type'
import Base from 'brain/Base'

export default class Query extends Base {

  static SortOrderDescending = 'desc'
  static SortOrderAscending = 'asc'

  /**
   * @type {Array}
   * @private
   */
  _sortBy = []

  /**
   * @type {Array}
   * @private
   */
  _order = []

  /**
   * @type {number}
   * @private
   */
  _limit = 5

  /**
   * @type {number}
   * @private
   */
  _offset = 0

  /**
   * @param {object|Query} [query]
   */
  constructor(query) {
    super()
    if (
        query !== undefined &&
        (query instanceof Query || isObject(query))
    ) {
      try {
        this.sortBy = query.sortBy
        this.order = query.order
        this.limit = query.limit
        this.offset = query.offset
      } catch (e) {
        console.error(`error constructing Query ${e}`)
      }
    }
  }

  get sortBy() {
    return this._sortBy
  }

  set sortBy(newVal) {
    this._sortBy = newVal
  }

  get order() {
    return this._order
  }

  set order(newVal) {
    this._order = newVal
  }

  get limit() {
    return this._limit
  }

  set limit(newVal) {
    this._limit = newVal
  }

  get offset() {
    return this._offset
  }

  set offset(newVal) {
    this._offset = newVal
  }
}