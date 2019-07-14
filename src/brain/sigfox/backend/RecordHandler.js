import {jsonRpcRequest} from 'utilities/network/index'
import Backend from './Backend'

const RecordHandler = {
  serviceProvider: 'SigfoxBackend-RecordHandler',

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect({criteria, query}) {
    let response = await jsonRpcRequest({
      method: `${RecordHandler.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(backend => new Backend(backend))
    return response
  },
}

export default RecordHandler