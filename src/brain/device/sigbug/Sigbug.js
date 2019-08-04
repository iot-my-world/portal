import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import {IdIdentifier} from 'brain/search/identifier/index'
import {SigfoxBackendDataCallbackMessage} from 'brain/sigfox/backend/callback/data/message'

export default class Sigbug extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _deviceId = ''

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
   * @type {string}
   * @private
   */
  _assignedPartyType = ''

  /**
   * @type {Id}
   * @private
   */
  _assignedId = new IdIdentifier()

  /**
   * @type {Message}
   * @private
   */
  _lastMessage = new SigfoxBackendDataCallbackMessage()

  /**
   * construct a new Sigbug Object
   * @param {Sigbug|Object} [sigbug]
   */
  constructor(sigbug) {
    super()
    if (sigbug !== undefined &&
      (sigbug instanceof Sigbug || isObject(sigbug))) {
      try {
        this._id = sigbug.id
        this._deviceId = sigbug.deviceId
        this._ownerPartyType = sigbug.ownerPartyType
        this._ownerId = new IdIdentifier(sigbug.ownerId)
        this._assignedPartyType = sigbug.assignedPartyType
        this._assignedId = new IdIdentifier(sigbug.assignedId)
        this._lastMessage = new SigfoxBackendDataCallbackMessage(sigbug.lastMessage)
      } catch (e) {
        throw new Error(`error constructing sigbug object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get deviceId() {
    return this._deviceId
  }

  set deviceId(newVal) {
    this._deviceId = newVal
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

  get assignedPartyType() {
    return this._assignedPartyType
  }

  set assignedPartyType(newVal) {
    this._assignedPartyType = newVal
  }

  get assignedId() {
    return this._assignedId
  }

  set assignedId(newVal) {
    this._assignedId = newVal
  }

  get lastMessage() {
    return this._lastMessage
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else {
      throw new Error(`cannot create identifier for sigbug if id is blank`)
    }
  }
}