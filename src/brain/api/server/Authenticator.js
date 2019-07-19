import {jsonRpcRequest} from 'utilities/network/index'

const Authenticator = {
  serviceProvider: 'Server-Authenticator',

  /**
   * Authenticate with api server
   * @param {string} usernameOrEmailAddress
   * @param {string} password
   * @returns {Promise<Object>}
   * @constructor
   */
  async Login({usernameOrEmailAddress, password}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.Login`,
      request: {
        usernameOrEmailAddress,
        password,
      },
    })
  },
}

export default Authenticator