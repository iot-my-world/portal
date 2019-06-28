import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {User} from 'brain/user/human/index'

const Administrator = {
  serviceProvider: 'HumanUser-Administrator',

  async GetMyUser() {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.GetMyUser`,
      request: {},
    })
    response.user = new User(response.user)
    return response
  },

  async UpdateAllowedFields({user}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.UpdateAllowedFields`,
      request: {
        user,
      },
    })
    response.user = new User(response.user)
    return response
  },

  async CheckPassword({password}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.CheckPassword`,
      request: {
        password,
      },
    })
  },

  async UpdatePassword({existingPassword, newPassword}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.UpdatePassword`,
      request: {
        existingPassword,
        newPassword,
      },
    })
  },

  async Create({user}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Create`,
      request: {
        user,
      },
    })
    response.user = new User(response.user)
    return response
  },

  async ForgotPassword({usernameOrEmailAddress}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.ForgotPassword`,
      request: {
        usernameOrEmailAddress,
      },
    })
  },

  async SetPassword({identifier, newPassword}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.SetPassword`,
      request: {
        identifier,
        newPassword,
      },
    })
  },
}

export default Administrator