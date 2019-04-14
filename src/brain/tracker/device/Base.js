import Base from 'brain/Base'

export default class BaseDevice extends Base {
  static Type = 'BASE_OVERRIDE_IN_CHILDREN'

  get type() {
    return this.constructor.Type
  }
}