import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {IdIdentifier} from 'brain/search/identifier'
import AdminEmailAddressIdentifier
  from 'brain/search/identifier/AdminEmailAddress'
import UserRecordHandler from './RecordHandler'

export default class User extends Base {
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
   * @type {string}
   * @private
   */
  _roles = ''

  /**
   * @type {string}
   * @private
   */
  _partyType = ''

  /**
   * @type {IdIdentifier}
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
        this._adminEmailAddress = user.adminEmailAddress
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

  get surname(){
    return this._surname
  }

  set surname(newVal) {
    this._surname = newVal
  }

  get username(){
    return this._username
  }

  set username(newVal) {
    this._username = newVal
  }

  get adminEmailAddress() {
    return this._adminEmailAddress
  }

  set adminEmailAddress(newVal) {
    this._adminEmailAddress = newVal
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
    } else if (this._adminEmailAddress !== '') {
      return new AdminEmailAddressIdentifier(this._adminEmailAddress)
    } else {
      throw new Error(
          `cannot create identifier for user if id, username and email address are all blank`)
    }
  }
}