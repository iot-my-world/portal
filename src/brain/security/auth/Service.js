import {jsonRpcRequest} from 'utilities/network'

const Service = {
  Login(usernameOrEmailAddress, password) {
    return jsonRpcRequest({
      method: 'Auth.Login',
      request: {
        usernameOrEmailAddress,
        password,
      },
    })
  },
}

export default Service