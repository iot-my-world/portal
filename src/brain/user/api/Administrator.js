import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import User from 'brain/user/api/User'

const Administrator = {
  serviceProvider: 'APIUser-Administrator',

  async Create({apiUser}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Create`,
      request: {
        apiUser,
      },
    })
    response.apiUser = new User(response.apiUser)
    return response
  },

  async UpdateAllowedFields({apiUser}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.UpdateAllowedFields`,
      request: {
        apiUser,
      },
    })
    response.apiUser = new User(response.apiUser)
    return response
  },
}

export default Administrator