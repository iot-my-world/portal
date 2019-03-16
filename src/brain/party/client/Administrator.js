import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {Client} from 'brain/party/client'

const Administrator = {
  async UpdateAllowedFields({client}) {
    let response = await jsonRpcRequest({
      method: 'ClientAdministrator.UpdateAllowedFields',
      request: {
        client: client.toPOJO(),
      },
    })
    response.client = new Client(response.client)
    return response
  },
}

export default Administrator