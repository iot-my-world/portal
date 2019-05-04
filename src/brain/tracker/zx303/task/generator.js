import Task from 'brain/tracker/zx303/task'
import {
  ResetDeviceZX303TaskType,
} from 'brain/tracker/zx303/task/types'
import {IdIdentifier} from 'brain/search/identifier'
import {StepGenerator} from './step'
import {
  SendResetCommand, WaitForReconnect,
} from 'brain/tracker/zx303/task/step/types'
import {TaskStatusPending} from 'brain/tracker/zx303/task/Task'

/**
 * Generates task with given taskType
 * @param {string} taskType
 * @param {ZX303}  device
 * @returns {Task}
 */
export default function generator(taskType, device) {
  switch (taskType) {
    case ResetDeviceZX303TaskType:
      return new Task({
        id: '',
        deviceId: new IdIdentifier(device.id),
        type: ResetDeviceZX303TaskType,
        status: TaskStatusPending,
        steps: [
          StepGenerator(SendResetCommand),
          StepGenerator(WaitForReconnect),
        ],
      })

    default:
      throw new TypeError(`invalid task type: ${taskType}`)
  }
}