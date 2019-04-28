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
   * @type {string}
   * @private
   */
  _status = TaskStatusPending

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
        this._id = task.id
        this._type = task.type
        this.status = task.status
        this._steps = task.steps.map(s => new Step(s))
      } catch (e) {
        throw new Error(`error constructing task object ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  set type(newVal) {
    this._type = newVal
  }

  get type() {
    return this._type
  }

  set status(newVal) {
    if (!AllTaskStatuses.includes(newVal)) {
      throw new TypeError(`invalid task status value: ${newVal}`)
    }
    this._status = newVal
  }

  set steps(newVal) {
    this._steps = newVal
  }

  get steps() {
    return this._steps
  }

}