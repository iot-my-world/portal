import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import Sigbug from './Sigbug'

const Administrator = {
  serviceProvider: 'SigbugDevice-Administrator',

  /**
   * @param {Sigbug} sigbug
   * @returns {Promise<any>}
   * @constructor
   */
  async Create({sigbug}) {
    let response = await jsonRpcRequest({
      method: `${Administrator.serviceProvider}.Create`,
      request: {sigbug},
    })
    response.sigbug = new Sigbug(response.sigbug)
    return response
  },

  /**
   * @param {Sigbug} sigbug
   * @returns {Promise<any>}
   * @constructor
   */
  async UpdateAllowedFields({sigbug}) {
    let response = await jsonRpcRequest({
      method: `${Administrator.serviceProvider}.UpdateAllowedFields`,
      request: {sigbug},
    })
    response.sigbug = new Sigbug(response.sigbug)
    return response
  },
}

export default Administrator