import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import DeviceRecordHandler from 'brain/tracker/zx303/RecordHandler'
import {IdIdentifier} from 'brain/search/identifier/index'
import {TK102DeviceType} from 'brain/tracker/types'

export default class TK102 extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _type = TK102DeviceType

  /**
   * @type {string}
   * @private
   */
  _manufacturerId = ''

  /**
   * @type {string}
   * @private
   */
  _simCountryCode = ''

  /**
   * @type {string}
   * @private
   */
  _simNumber = ''

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
   * construct a new TK102 Object
   * @param {TK102|Object} [tk102]
   */
  constructor(tk102) {
    super()
    if (tk102 !== undefined && (tk102 instanceof TK102 || isObject(tk102))) {
      try {
        this._id = tk102.id
        this._manufacturerId = tk102.manufacturerId
        this._simCountryCode = tk102.simCountryCode
        this._simNumber = tk102.simNumber
        this._ownerPartyType = tk102.ownerPartyType
        this._ownerId = new IdIdentifier(tk102.ownerId)
        this._assignedPartyType = tk102.assignedPartyType
        this._assignedId = new IdIdentifier(tk102.assignedId)
      } catch (e) {
        throw new Error(`error constructing tk102 object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get manufacturerId() {
    return this._manufacturerId
  }

  set manufacturerId(newVal) {
    this._manufacturerId = newVal
  }

  get simCountryCode() {
    return this._simCountryCode
  }

  set simCountryCode(newVal) {
    this._simCountryCode = newVal
  }

  get simNumber() {
    return this._simNumber
  }

  set simNumber(newVal) {
    this._simNumber = newVal
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

  create() {
    return DeviceRecordHandler.Create(this)
  }

  validate(method = '') {
    return DeviceRecordHandler.Validate(this, method)
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else {
      throw new Error(`cannot create identifier for tk102 if id is blank`)
    }
  }
}
