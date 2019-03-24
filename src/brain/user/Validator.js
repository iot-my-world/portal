import {jsonRpcRequest} from 'utilities/network/index'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {

  /**
   * @param {User} user
   * @param {string} action
   * @returns {Promise<any>}
   */
  async Validate({user, action}) {
    let response = await jsonRpcRequest({
      method: 'UserValidator.Validate',
      request: {
        user: user.toPOJO(),
        action,
      },
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator