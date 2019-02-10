export default class MethodFailed extends Error {
  /**
   * The error returned from the server when
   * the method failed
   * @type {*}
   * @private
   */
  _error

  /**
   * The method which failed
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
    this._error = error
    this._method = method
  }

  toString() {
    return `method ${this._method} failed with error ${this._error}`
  }
}