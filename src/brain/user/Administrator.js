import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {User} from 'brain/user/index'

const Administrator = {
  async GetMyUser() {
    let response = await jsonRpcRequest({
      method: 'UserAdministrator.GetMyUser',
      request: {},
    })
    response.user = new User(response.user)
    return response
  },

  async UpdateAllowedFields({user}) {
    let response = await jsonRpcRequest({
      method: 'UserAdministrator.UpdateAllowedFields',
      request: {
        user: user.toPOJO(),
      },
    })
    response.user = new User(response.user)
    return response
  },

  async CheckPassword({password}) {
    return await jsonRpcRequest({
      method: 'UserAdministrator.CheckPassword',
      request: {
        password,
      },
    })
  },

  async UpdatePassword({existingPassword, newPassword}) {
    return await jsonRpcRequest({
      method: 'UserAdministrator.UpdatePassword',
      request: {
        existingPassword,
        newPassword,
      },
    })
  },

  async Create({user}) {
    let response = await jsonRpcRequest({
      method: 'UserAdministrator.Create',
      request: {
        user: user.toPOJO(),
      },
    })
    response.user = new User(response.user)
    return response
  },
}

export default Administrator