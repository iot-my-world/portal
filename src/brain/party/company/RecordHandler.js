import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'

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
        resolve(result)
      }).catch(error => reject(error))
    })
  }
}