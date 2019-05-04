import {jsonRpcRequest} from 'utilities/network/index'
import User from './User'

const RecordHandler = {

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let response = await jsonRpcRequest({
      method: 'APIUserRecordHandler.Collect',
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