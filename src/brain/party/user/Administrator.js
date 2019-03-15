import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {User} from 'brain/party/user'

const Administrator = {
  async GetMyUser() {
    let response = await jsonRpcRequest({
      method: 'UserAdministrator.GetMyUser',
      request: {},
    })
    response.user = new User(response.user)
    return response
  },
}

export default Administrator