import {jsonRpcRequest} from 'utilities/network'

const Service = {
  async Login(usernameOrEmailAddress, password) {
    return await jsonRpcRequest({
      method: 'Auth.Login',
      request: {
        usernameOrEmailAddress,
        password,
      },
    })
  },
}

export default Service