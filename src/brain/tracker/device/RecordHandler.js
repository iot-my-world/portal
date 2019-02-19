import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'
import Device from './Device'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

export default class RecordHandler {

  /**
   * Create a new device
   * @param {Device} device
   * @constructor
   */
  static Create(device) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'CompanyRecordHandler.Create',
        request: {
          device: device.toPOJO(),
        },
      }).then(result => {
        resolve(new Device(result.device))
      }).catch(error => reject(error))
    })
  }

  /**
   * Validate a device
   * @param {Device} device
   * @param {string} method
   * @constructor
   */
  static Validate(device, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'CompanyRecordHandler.Validate',
        request: {
          device: device.toPOJO(),
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
        method: 'CompanyRecordHandler.Collect',
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