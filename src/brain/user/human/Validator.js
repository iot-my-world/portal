import {jsonRpcRequest} from 'utilities/network/index'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  serviceProvider: 'HumanUser-Validator',

  /**
   * @param {User} user
   * @param {string} action
   * @returns {Promise<any>}
   */
  async Validate({user, action}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Validate`,
      request: {
        user,
        action,
      },
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator