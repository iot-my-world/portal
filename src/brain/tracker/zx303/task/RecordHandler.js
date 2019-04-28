import {jsonRpcRequest} from 'utilities/network'
import Task from './Task'

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let response = await jsonRpcRequest({
      method: 'ZX303TaskRecordHandler.Collect',
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(task => new Task(task))
    return response
  },
}

export default RecordHandler