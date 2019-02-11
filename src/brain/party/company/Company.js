import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'
import {IdIdentifier, AdminEmailAddressIdentifier} from 'brain/search/identifier'

export default class Company extends Base {
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
   * construct a new Company Object
   * @param {Company|Object} [company]
   */
  constructor(company) {
    super()
    if (
        (company !== undefined) &&
        (
            (company instanceof Company) ||
            isObject(company)
        )
    ) {
      try {
        this._id = company.id
        this._name = company.name
        this._adminEmailAddress = company.adminEmailAddress
      } catch (e) {
        throw new Error(`error constructing company object: ${e}`)
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

  create() {
    return CompanyRecordHandler.Create(this)
  }

  validate(method = '') {
    return CompanyRecordHandler.Validate(this, method)
  }

  get identifier() {
    if (this._id !== '') {
      return new IdIdentifier(this._id)
    } else if (this._adminEmailAddress !== '') {
      return new AdminEmailAddressIdentifier(this._adminEmailAddress)
    } else {
      throw new Error(
          `cannot create identifier for company if id and adminEmailAddress are both blank`)
    }
  }
}