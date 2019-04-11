import {jsonRpcRequest} from 'utilities/network/index'
import ZX303 from './ZX303'

const Administrator = {
  /**
   * Change Owner of TK102 device
   * @param tk102
   * @returns {Promise<ZX303>}
   * @constructor
   */
  ChangeOwnershipAndAssignment(tk102) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceAdministrator.ChangeOwnershipAndAssignment',
        request: {
          tk102,
        },
      })
          .then(result => {
            resolve(new ZX303(result.tk102))
          })
          .catch(error => reject(error))
    })
  },
}

export default Administrator
