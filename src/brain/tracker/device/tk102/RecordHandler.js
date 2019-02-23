import {jsonRpcRequest} from 'utilities/network/index'
import config from 'react-global-configuration'
import TK102 from './TK102'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

export default class RecordHandler {

  /**
   * Create a new tk102
   * @param {TK102} tk102
   * @constructor
   */
  static Create(tk102) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'TK102DeviceRecordHandler.Create',
        request: {
          tk102: tk102.toPOJO(),
        },
      }).then(result => {
        resolve(new TK102(result.tk102))
      }).catch(error => reject(error))
    })
  }

  /**
   * Validate a tk102
   * @param {TK102} tk102
   * @param {string} method
   * @constructor
   */
  static Validate(tk102, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'TK102DeviceRecordHandler.Validate',
        request: {
          tk102: tk102.toPOJO(),
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
        method: 'TK102DeviceRecordHandler.Collect',
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