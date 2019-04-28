import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import Step from './step'
import {IdIdentifier} from 'brain/search/identifier/index'

export const TaskStatusPending = 'Pending'
export const TaskStatusExecuting = 'Executing'
export const TaskStatusFinished = 'Finished'
export const TaskStatusFailed = 'Failed'

export const AllTaskStatuses = [
  TaskStatusPending,
  TaskStatusExecuting,
  TaskStatusFinished,
  TaskStatusFailed,
]

export default class Task extends Base {
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
   * @type {Step[]}
   * @private
   */
  _steps = []

  /**
   * construct a new Task Object
   * @param {Task|Object} [task]
   */
  constructor(task) {
    super()
    if (task !== undefined && (task instanceof Task || isObject(task))) {
      try {

      } catch (e) {
        throw new Error(`error constructing task object ${e}`)
      }
    }
  }
}