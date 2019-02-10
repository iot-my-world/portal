import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'
import Company from './Company'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

export default class RecordHandler {

  /**
   * Create a new company
   * @param {Company} company
   * @constructor
   */
  static Create(company) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'CompanyRecordHandler.Create',
        request: {
          company: company.toPOJO(),
        },
      }).then(result => {
        resolve(new Company(result.company))
      }).catch(error => reject(error))
    })
  }

  /**
   * Validate a company
   * @param {Company} company
   * @param {string} method
   * @constructor
   */
  static Validate(company, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'CompanyRecordHandler.Validate',
        request: {
          company: company.toPOJO(),
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  }

  /**
   * @param {array} criteria
   * @param {Query} query
   * @constructor
   */
  static Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'CompanyRecordHandler.Collect',
        request: {
          criteria: criteria.map(criterion => criterion.toPOJO()),
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  }
}