import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'

export default class Service {
  static Login(usernameOrEmailAddress, password) {
    return jsonRpcRequest({
      url: config.get('brainAPIUrl'),
      method: 'Login.Login',
      request: {
        usernameOrEmailAddress,
        password,
      },
    })
  }
}