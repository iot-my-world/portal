import {jsonRpcRequest} from 'utilities/network'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {

  /**
   * @param {Client} client
   * @param {string} action
   * @returns {Promise<any>}
   */
  async Validate({client, action}) {
    let response = await jsonRpcRequest({
      method: 'ClientValidator.Validate',
      request: {
        client: client.toPOJO(),
        action,
      },
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator