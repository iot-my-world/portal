
export default class ContactFailed extends Error {
  /**
   * Error
   * @type {*}
   * @private
   */
  _error

  /**
   * The method which failed to contact server
   * @type {string}
   * @private
   */
  _method = ''

  /**
   * construct a new Company Object
   * @param {*} error
   * @param {string} method
   */
  constructor(error, method) {
    super()
    this._method = method
    this._error = error
  }

  toString() {
    return `server contact failed for method ${this._method} with error ${this._error}`
  }
}