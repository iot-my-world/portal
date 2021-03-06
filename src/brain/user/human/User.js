import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {
  UsernameIdentifier,
  EmailAddressIdentifier,
  IdIdentifier,
} from 'brain/search/identifier/index'
import UserRecordHandler from './RecordHandler'
import {stringToBytes} from 'utilities/type/type'

export default class User extends Base {
  static ignoreInPost = []

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
  _surname = ''

  /**
   * @type {string}
   * @private
   */
  _username = ''

  /**
   * @type {string}
   * @private
   */
  _emailAddress = ''

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
  _parentPartyType = ''

  /**
   * @type {Id}
   * @private
   */
  _parentId = new IdIdentifier()

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
   * @type {boolean}
   * @private
   */
  _registered = false

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
        this._surname = user.surname
        this._username = user.username
        this._emailAddress = user.emailAddress
        this._password = user.password
        this._roles = user.roles
        this._parentPartyType = user.parentPartyType
        this._parentId = new IdIdentifier(user.parentId)
        this._partyType = user.partyType
        this._partyId = new IdIdentifier(user.partyId)
        this._registered = user.registered
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

  get surname() {
    return this._surname
  }

  set surname(newVal) {
    this._surname = newVal
  }

  get username() {
    return this._username
  }

  set username(newVal) {
    this._username = newVal
  }

  get emailAddress() {
    return this._emailAddress
  }

  set emailAddress(newVal) {
    this._emailAddress = newVal
  }

  get password() {
    return this._password
  }

  set password(newVal) {
    this._password = newVal
  }

  get parentPartyType() {
    return this._parentPartyType
  }

  set parentPartyType(newVal) {
    this._parentPartyType = newVal
  }

  get parentId() {
    return this._parentId
  }

  set parentId(newVal) {
    this._parentId = newVal
  }

  get partyType() {
    return this._partyType
  }

  set partyType(newVal) {
    this._partyType = newVal
  }

  get partyId() {
    return this._partyId
  }

  set partyId(newVal) {
    this._partyId = newVal
  }

  get registered() {
    return this._registered
  }

  // should never be able to set registered

  get roles() {
    return this._roles
  }

  set roles(newVal) {
    this._roles = newVal
  }

  create() {
    return UserRecordHandler.Create(this)
  }

  validate(method = '') {
    return UserRecordHandler.Validate(this, method)
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else if (this._emailAddress !== '') {
      return new EmailAddressIdentifier(this._emailAddress)
    } else if (this._username !== '') {
      return new UsernameIdentifier(this._username)
    } else {
      throw new Error(
          `cannot create identifier for user if id, username and email address are all blank`)
    }
  }

  toJSON() {
    let retObj = super.toPOJO()
    retObj.password = stringToBytes(this._password)
    return retObj
  }
}