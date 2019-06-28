import {jsonRpcRequest} from 'utilities/network'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  serviceProvider: 'Client-Validator',
  /**
   * @param {Client} client
   * @param {string} action
   * @returns {Promise<any>}
   */
  async Validate({client, action}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Validate`,
      request: {
        client,
        action,
      },
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator