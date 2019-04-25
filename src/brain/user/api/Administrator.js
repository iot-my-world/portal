import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import User from 'brain/user/api/User'

const Administrator = {
  async Create({apiUser}) {
    let response = await jsonRpcRequest({
      method: 'APIUserAdministrator.Create',
      request: {
        apiUser,
      },
    })
    response.apiUser = new User(response.apiUser)
    return response
  },

  async UpdateAllowedFields({apiUser}) {
    let response = await jsonRpcRequest({
      method: 'APIUserAdministrator.UpdateAllowedFields',
      request: {
        apiUser,
      },
    })
    response.apiUser = new User(response.apiUser)
    return response
  },
}

export default Administrator