import {jsonRpcRequest} from 'utilities/network/index'
import SF001 from './SF001'

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let response = await jsonRpcRequest({
      method: 'SF001DeviceRecordHandler.Collect',
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(sf001 => new SF001(sf001))
    return response
  },
}

export default RecordHandler