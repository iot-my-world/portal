import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'

export const StepStatusPending = 'Pending'
export const StepStatusExecuting = 'Executing'
export const StepStatusFinished = 'Finished'
export const StepStatusFailed = 'Failed'

export const AllStepStatuses = [
  StepStatusPending,
  StepStatusExecuting,
  StepStatusFinished,
  StepStatusFailed,
]

export default class Step extends Base {
  /**
   * @type {string}
   * @private
   */
  _type = ''

  /**
   * @type {string}
   * @private
   */
  _status = StepStatusPending

  /**
   * construct a new Step Object
   * @param {Step|Object} [step]
   */
  constructor(step) {
    super()
    if (step !== undefined && (step instanceof Step || isObject(step))) {
      try {
        this._type = step.type
        this.status = step.status
      } catch (e) {
        throw new Error(`error constructing step object ${e}`)
      }
    }
  }

  set type(newVal) {
    this._type = newVal
  }

  get type() {
    return this._type
  }

  set status(newVal) {
    if (!AllStepStatuses.includes(newVal)) {
      throw new TypeError(`invalid status value: ${newVal}`)
    }
    this._status = newVal
  }

  get status() {
    return this._status
  }
}