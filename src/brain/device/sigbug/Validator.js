import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  serviceProvider: 'SigbugDevice-Validator',

  /**
   * @param {SigbugManagement} sigbug
   * @param {string} action
   * @returns {Promise<any>}
   * @constructor
   */
  async Validate({sigbug, action}) {
    let response = await jsonRpcRequest({
      method: `${Validator.serviceProvider}.Validate`,
      request: {sigbug, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator