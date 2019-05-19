import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export default class Report extends Base {

  /**
   * @type {BatteryReading[]}
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
      try {
        this._readings = report.readings.map(reading => new BatteryReading(reading))
      } catch (e) {
        console.error('error constructing new report object', e)
      }
    }
  }

  get readings() {
    return this._readings
  }

  set readings(newVal) {
    this._readings = newVal.map(reading => new BatteryReading(reading))
  }
}

class BatteryReading extends Base {
  /**
   * @type {number}
   * @private
   */
  _batteryPercentage = 0

  /**
   * @type {number}
   * @private
   */
  _timestamp = 0

  /**
   * construct a new BatteryReading Object
   * @param {BatteryReading|Object} [batteryReading]
   */
  constructor(batteryReading) {
    super()
    if (
      batteryReading !== undefined &&
      (batteryReading instanceof BatteryReading || isObject(batteryReading))
    ) {
      try {
        this._batteryPercentage = batteryReading.batteryPercentage
        this._timestamp = batteryReading.timestamp
      } catch (e) {
        console.error('error constructing new report object', e)
      }
    }
  }

  get batteryPercentage() {
    return this._batteryPercentage
  }

  set batteryPercentage(newVal) {
    this._batteryPercentage = newVal
  }

  get timestamp() {
    return this._timestamp
  }

  set timestamp(newVal) {
    this._timestamp = newVal
  }
}