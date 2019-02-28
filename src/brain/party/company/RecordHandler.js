import {jsonRpcRequest} from 'utilities/network'
import Company from './Company'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const RecordHandler = {
  /**
   * Create a new company
   * @param {Company} company
   * @constructor
   */
  Create(company) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'CompanyRecordHandler.Create',
        request: {
          company: company.toPOJO(),
        },
      }).then(result => {
        resolve(new Company(result.company))
      }).catch(error => reject(error))
    })
  },

  /**
   * Validate a company
   * @param {Company} company
   * @param {string} method
   * @constructor
   */
  Validate(company, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'CompanyRecordHandler.Validate',
        request: {
          company: company.toPOJO(),
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  },

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'CompanyRecordHandler.Collect',
        request: {
          criteria: criteria
              ? criteria.map(criterion => criterion.toPOJO())
              : undefined,
          query: query
              ? query.toPOJO()
              : undefined,
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}

export default RecordHandler