import {jsonRpcRequest} from 'utilities/network/index'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {

  /**
   * @param {APIUser} apiUser
   * @param {string} action
   * @returns {Promise<any>}
   */
  async Validate({apiUser, action}) {
    let response = await jsonRpcRequest({
      method: 'APIUserValidator.Validate',
      request: {
        apiUser,
        action,
      },
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator