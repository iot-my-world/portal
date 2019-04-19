import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import User from 'brain/user/api/User'

const Administrator = {
  async Create({user}) {
    let response = await jsonRpcRequest({
      method: 'APIUserAdministrator.Create',
      request: {
        user,
      },
    })
    response.user = new User(response.user)
    return response
  },
  async UpdateAllowedFields({user}) {
    let response = await jsonRpcRequest({
      method: 'APIUserAdministrator.UpdateAllowedFields',
      request: {
        user,
      },
    })
    response.user = new User(response.user)
    return response
  },
}

export default Administrator