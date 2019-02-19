import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import ClientRecordHandler from 'brain/party/client/RecordHandler'
import {
  IdIdentifier,
  AdminEmailAddressIdentifier,
} from 'brain/search/identifier'

export default class Client extends Base {
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
  _adminEmailAddress = ''

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
   * construct a new Client Object
   * @param {Client|Object} [client]
   */
  constructor(client) {
    super()
    if (
        (client !== undefined) &&
        (
            (client instanceof Client) ||
            isObject(client)
        )
    ) {
      try {
        this._id = client.id
        this._name = client.name
        this._adminEmailAddress = client.adminEmailAddress
        this._parentPartyType = client.parentPartyType
        this._parentId = new IdIdentifier(client.parentId)
      } catch (e) {
        throw new Error(`error constructing client object: ${e}`)
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

  get adminEmailAddress() {
    return this._adminEmailAddress
  }

  set adminEmailAddress(newVal) {
    this._adminEmailAddress = newVal
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

  create() {
    return ClientRecordHandler.Create(this)
  }

  validate(method = '') {
    return ClientRecordHandler.Validate(this, method)
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else if (this._adminEmailAddress !== '') {
      return new AdminEmailAddressIdentifier(this._adminEmailAddress)
    } else {
      throw new Error(
          `cannot create identifier for client if id and adminEmailAddress are both blank`)
    }
  }
}