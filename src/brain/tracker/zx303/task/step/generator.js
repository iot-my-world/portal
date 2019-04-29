import Step from 'brain/tracker/zx303/task/step'
import {
  SendResetCommand,
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
        id: '',
        type: SendResetCommand,
        status: StepStatusPending,
      })
    default:
      throw new TypeError(`invalid step type: ${stepType}`)
  }
}