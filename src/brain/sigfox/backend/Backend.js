import Base from 'brain/Base'
import {IdIdentifier, NameIdentifier} from 'brain/search/identifier'
import {isObject} from 'utilities/type/type'

export default class Backend extends Base {
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
  _token = ''

  /**
   * @type {string}
   * @private
   */
  _ownerPartyType = ''

  /**
   * @type {Id}
   * @private
   */
  _ownerId = new IdIdentifier()

  /**
   * construct a new Backend Object
   * @param {Backend|Object} [backend]
   */
  constructor(backend) {
    super()
    if (backend !== undefined && (backend instanceof Backend || isObject(backend))) {
      try {
        this._id = backend.id
        this._name = backend.name
        this._token = backend.token
        this._ownerPartyType = backend.ownerPartyType
        this._ownerId = new IdIdentifier(backend.ownerId)
      } catch (e) {
        throw new Error(`error constructing backend object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  set name(val) {
    this._name = val
  }

  get token() {
    return this._token
  }

  get ownerPartyType() {
    return this._ownerPartyType
  }

  set ownerPartyType(newVal) {
    this._ownerPartyType = newVal
  }

  get ownerId() {
    return this._ownerId
  }

  set ownerId(newVal) {
    this._ownerId = newVal
  }

  get identifier() {
    switch (true) {
      case this._id !== '':
        return new IdIdentifier(this._id)
      case this._name !== '':
        return new NameIdentifier(this._name)
      default:
        throw new Error(
          'cannot make identifier for backend if name and id are both blank',
        )
    }
  }
}