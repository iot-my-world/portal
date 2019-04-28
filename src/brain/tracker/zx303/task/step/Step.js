import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {IdIdentifier} from 'brain/search/identifier/index'

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
  _id = ''

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

      } catch (e) {
        throw new Error(`error constructing step object ${e}`)
      }
    }
  }
}