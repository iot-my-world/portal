import Step from 'brain/tracker/zx303/task/step'
import {
  SendResetCommand, WaitForReconnect,
} from 'brain/tracker/zx303/task/step/types'
import {
  StepStatusPending,
} from 'brain/tracker/zx303/task/step/Step'

/**
 * Generates step with given stepType
 * @param stepType
 * @returns {Step}
 */
export default function generator(stepType) {
  switch (stepType) {
    case SendResetCommand:
      return new Step({
        type: SendResetCommand,
        status: StepStatusPending,
      })
    case WaitForReconnect:
      return new Step({
        type: WaitForReconnect,
        status: StepStatusPending,
      })
    default:
      throw new TypeError(`invalid step type: ${stepType}`)
  }
}