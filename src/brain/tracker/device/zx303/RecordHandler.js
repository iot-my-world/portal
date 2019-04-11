import {jsonRpcRequest} from 'utilities/network/index'
import ZX303 from './ZX303'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const RecordHandler = {

  /**
   * Create a new tk102
   * @param {ZX303} tk102
   * @constructor
   */
  Create(tk102) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceRecordHandler.Create',
        request: {
          tk102,
        },
      }).then(result => {
        resolve(new ZX303(result.tk102))
      }).catch(error => reject(error))
    })
  },

  /**
   * Validate a tk102
   * @param {ZX303} tk102
   * @param {string} method
   * @constructor
   */
  Validate(tk102, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceRecordHandler.Validate',
        request: {
          tk102,
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  },

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceRecordHandler.Collect',
        request: {
          criteria,
          query,
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}

export default RecordHandler