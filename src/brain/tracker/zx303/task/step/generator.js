import Step from 'brain/tracker/zx303/task/step'
import {
  SendResetCommand,
} from 'brain/tracker/zx303/task/step/types'

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
        // status: StepStatusPending, // leave default
      })
    default:
      throw new TypeError(`invalid step type: ${stepType}`)
  }
}