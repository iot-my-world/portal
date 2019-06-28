import {jsonRpcRequest} from 'utilities/network'
import Client from './Client'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const RecordHandler = {
  serviceProvider: 'Client-RecordHandler',

  /**
   * Create a new client
   * @param {Client} client
   * @constructor
   */
  async Create(client) {
    const response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Create`,
      request: {
        client,
      },
    })
    return new Client(response.client)
  },

  /**
   * Validate a client
   * @param {Client} client
   * @param {string} method
   * @constructor
   */
  async Validate(client, method) {
    const response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Validate`,
      request: {
        client,
        method,
      },
    })
    return new ReasonsInvalid(response.reasonsInvalid)
  },

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    const response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(client => new Client(client))
    return response
  },
}
export default RecordHandler