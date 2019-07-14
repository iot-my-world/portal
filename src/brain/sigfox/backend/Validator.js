import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  serviceProvider: 'SigfoxBackend-Validator',

  /**
   * @param {BackendManagement} backend
   * @param {string} action
   * @returns {Promise<any>}
   * @constructor
   */
  async Validate({backend, action}) {
    let response = await jsonRpcRequest({
      method: `${Validator.serviceProvider}.Validate`,
      request: {backend, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator