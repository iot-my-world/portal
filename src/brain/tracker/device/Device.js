import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import DeviceRecordHandler from 'brain/tracker/device/RecordHandler'
import {
  IdIdentifier,
} from 'brain/search/identifier'

export default class Device extends Base {
  /**
   * @type {string}
   * @private
   */
  _id = ''

  /**
   * @type {string}
   * @private
   */
  _imei = ''

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
   * construct a new Device Object
   * @param {Device|Object} [device]
   */
  constructor(device) {
    super()
    if (
        (device !== undefined) &&
        (
            (device instanceof Device) ||
            isObject(device)
        )
    ) {
      try {
        this._id = device.id
        this._imei = device.imei
        this._simCountryCode = device.simCountryCode
        this._simNumber = device.simNumber
        this._ownerPartyType = device.ownerPartyType
        this._ownerId = new IdIdentifier(device.ownerId)
        this._assignedPartyType = device.assignedPartyType
        this._assignedId = new IdIdentifier(device.assignedId)
      } catch (e) {
        throw new Error(`error constructing device object: ${e}`)
      }
    }
  }

  get id() {
    return this._id
  }

  get imei(){
    return this._imei
  }

  set imei(newVal) {
    this._imei = newVal
  }

  get simCountryCode() {
    return this._simCountryCode
  }

  set simCountryCode(newVal) {
    this._simCountryCode = newVal
  }

  get simNumber (){
    return this._simNumber
  }

  set simNumber(newVal){
    this._simNumber = newVal
  }

  get ownerPartyType(){
    return this._ownerPartyType
  }

  set ownerPartyType(newVal){
    this._ownerPartyType = newVal
  }

  get ownerId() {
    return this._ownerId
  }

  set ownerId(newVal) {
    this._ownerId = newVal
  }

  get assignedPartyType(){
    return this._assignedPartyType
  }

  set assignedPartyType(newVal){
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
      throw new Error(
          `cannot create identifier for device if id is blank`)
    }
  }
}