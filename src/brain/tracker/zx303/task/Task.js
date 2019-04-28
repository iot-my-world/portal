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
   * @type {Id}
   * @private
   */
  _deviceId = new IdIdentifier()

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
        this.deviceId = task.deviceId
      } catch (e) {
        throw new Error(`error constructing task object ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get deviceId() {
    return this._deviceId
  }

  set deviceId(newVal) {
    this._deviceId = new IdIdentifier(newVal)
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