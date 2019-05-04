import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {
  UsernameIdentifier,
  IdIdentifier,
} from 'brain/search/identifier/index'
import {stringToBytes} from 'utilities/type/type'

export default class User extends Base {
  static ignoreInPost = [
  ]

  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _name = ''

  /**
   * @type {string}
   * @private
   */
  _description = ''

  /**
   * @type {string}
   * @private
   */
  _username = ''

  /**
   * @type {string}
   * @private
   */
  _password = ''

  /**
   * @type {string[]}
   * @private
   */
  _roles = []

  /**
   * @type {string}
   * @private
   */
  _partyType = ''

  /**
   * @type {Id}
   * @private
   */
  _partyId = new IdIdentifier()

  /**
   * construct a new User Object
   * @param {User|Object} [user]
   */
  constructor(user) {
    super()
    if (
        (user !== undefined) &&
        (
            (user instanceof User) ||
            isObject(user)
        )
    ) {
      try {
        this._id = user.id
        this._name = user.name
        this._description = user.description
        this._username = user.username
        this._password = user.password
        this._roles = user.roles
        this._partyType = user.partyType
        this._partyId = new IdIdentifier(user.partyId)
      } catch (e) {
        throw new Error(`error constructing user object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  set name(newVal) {
    this._name = newVal
  }

  get description() {
    return this._description
  }

  set description(newVal) {
    this._description = newVal
  }

  get username() {
    return this._username
  }

  set username(newVal) {
    this._username = newVal
  }

  get password() {
    return this._password
  }

  set password(newVal) {
    this._password = newVal
  }

  get partyType(){
    return this._partyType
  }

  set partyType(newVal) {
    this._partyType = newVal
  }

  get partyId(){
    return this._partyId
  }

  set partyId(newVal){
    this._partyId = newVal
  }

  get roles() {
    return this._roles
  }

  set roles(newVal) {
    this._roles = newVal
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else if (this._username !== '') {
      return new UsernameIdentifier(this._username)
    } else {
      throw new Error(
          `cannot create identifier for user if id, username are both blank`)
    }
  }

  toJSON() {
    let retObj = super.toPOJO()
    retObj.password = stringToBytes(this._password)
    return retObj
  }
}