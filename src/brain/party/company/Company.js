import Base from 'brain/Base'
import {isObject} from 'utilities/type/index'
import CompanyRecordHandler from 'brain/party/company/RecordHandler'

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
  _adminEmail = ''

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
        this._adminEmail = company.adminEmail
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

  get adminEmail() {
    return this._adminEmail
  }

  set adminEmail(newVal) {
    this._adminEmail = newVal
  }

  create() {
    return CompanyRecordHandler.Create(this)
  }

  validate(ignoreReasonsMethod = '') {
    return CompanyRecordHandler.Validate(this, ignoreReasonsMethod)
  }

}