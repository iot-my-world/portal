import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'
import Client from './Client'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

export default class RecordHandler {

  /**
   * Create a new client
   * @param {Client} client
   * @constructor
   */
  static Create(client) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'ClientRecordHandler.Create',
        request: {
          client: client.toPOJO(),
        },
      }).then(result => {
        resolve(new Client(result.client))
      }).catch(error => reject(error))
    })
  }

  /**
   * Validate a client
   * @param {Client} client
   * @param {string} method
   * @constructor
   */
  static Validate(client, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'ClientRecordHandler.Validate',
        request: {
          client: client.toPOJO(),
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  }

  /**
   * @param {array} criteria
   * @param {Query} query
   * @constructor
   */
  static Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'ClientRecordHandler.Collect',
        request: {
          criteria: criteria.map(criterion => criterion.toPOJO()),
          query: query.toPOJO(),
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  }
}