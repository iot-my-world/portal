import BrainBase from 'brain/Base'

export default class Base extends BrainBase {
  static type = 'notOverriddenInChild'

  get type(){
    return this.constructor.type
  }
}
