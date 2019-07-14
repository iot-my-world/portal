import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import Backend from './Backend'

const Administrator = {
  serviceProvider: 'SigfoxBackend-Administrator',

  /**
   * @param {Backend} backend
   * @returns {Promise<any>}
   * @constructor
   */
  async Create({backend}) {
    let response = await jsonRpcRequest({
      method: `${Administrator.serviceProvider}.Create`,
      request: {backend},
    })
    response.backend = new Backend(response.backend)
    return response
  },

  /**
   * @param {Backend} backend
   * @returns {Promise<any>}
   * @constructor
   */
  async UpdateAllowedFields({backend}) {
    let response = await jsonRpcRequest({
      method: `${Administrator.serviceProvider}.UpdateAllowedFields`,
      request: {backend},
    })
    response.backend = new Backend(response.backend)
    return response
  },
}

export default Administrator