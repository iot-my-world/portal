import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {Client} from 'brain/party/client'

const Administrator = {
  serviceProvider: 'Client-Administrator',
  async Create({client}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Create`,
      request: {
        client,
      },
    })
    response.client = new Client(response.client)
    return response
  },

  async UpdateAllowedFields({client}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.UpdateAllowedFields`,
      request: {
        client,
      },
    })
    response.client = new Client(response.client)
    return response
  },
}

export default Administrator