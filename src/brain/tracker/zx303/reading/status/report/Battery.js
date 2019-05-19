import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export default class Report extends Base {

  /**
   * @type {number[][]}
   * @private
   */
  _readings = []

  /**
   * construct a new Report Object
   * @param {Report|Object} [report]
   */
  constructor(report) {
    super()

    if (
      report !== undefined &&
      (report instanceof Report || isObject(report))
    ) {
      this._readings = report.readings.map(reading => [reading[0]*1000, reading[1]])
    }
  }

  get readings() {
    return this._readings
  }

  set readings(newVal) {
    this._readings = newVal.map(reading => [...reading])
  }
}