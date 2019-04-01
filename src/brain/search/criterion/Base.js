import Base from 'brain/Base'

export default class BaseCriterion extends Base {
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
  toJSON() {
    console.log('Calling toJSON on identifier on crit')
    return {
      type: this.type,
      value: this.toPOJO(),
    };
  }
}