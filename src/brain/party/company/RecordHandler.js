import {jsonRpcRequest} from 'utilities/network'
import Company from './Company'

const RecordHandler = {
  serviceProvider: 'Company-RecordHandler',

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect({criteria, query}) {
    const response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(company => new Company(company))
    return response
  },
}

export default RecordHandler