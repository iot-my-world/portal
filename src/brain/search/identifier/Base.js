import Base from 'brain/Base'

export default class BaseIdentifier extends Base {
  static Type = 'BASE_OVERRIDE_IN_CHILDREN'

  get type() {
    return this.constructor.Type
  }

  wrap() {
    return {
      type: this.type,
      value: this.toPOJO(),
    }
  }
}