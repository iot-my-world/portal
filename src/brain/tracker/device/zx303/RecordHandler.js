import {jsonRpcRequest} from 'utilities/network/index'
import ZX303 from './ZX303'

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let response = await jsonRpcRequest({
      method: 'ZX303DeviceRecordHandler.Collect',
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(zx303 => new ZX303(zx303))
    return response
  },
}

export default RecordHandler