import ReasonInvalid from './ReasonInvalid'
import {isArray, isObject} from 'utilities/type/index'

export default class ReasonsInvalid {
  /**
   * @type {ReasonInvalid[]}
   * @private
   */
  _reasonsInvalid = []

  /**
   * construct a new ReasonsInvalid Object
   * @param {ReasonsInvalid|Object|ReasonInvalid[]} [reasonsInvalid]
   */
  constructor(reasonsInvalid) {
    if (
        (reasonsInvalid !== undefined) &&
        (
            (reasonsInvalid instanceof ReasonsInvalid) ||
            isObject(reasonsInvalid)
        )
    ) {
      try {
        this._reasonsInvalid =
            reasonsInvalid.reasonsInvalid.map(r => new ReasonInvalid(r))
      } catch (e) {
        throw new Error(`error constructing reasonInvalid object: ${e}`)
      }
    } else if (isArray(reasonsInvalid)) {
      this._reasonsInvalid = reasonsInvalid.map(r => new ReasonInvalid(r))
    }
  }

  get reasonsInvalid() {
    return this._reasonsInvalid
  }
}