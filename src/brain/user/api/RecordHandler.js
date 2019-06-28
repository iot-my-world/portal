import {jsonRpcRequest} from 'utilities/network/index'
import User from './User'

const RecordHandler = {
  serviceProvider: 'APIUser-RecordHandler',

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(user => new User(user))
    return response
  },
}

export default RecordHandler