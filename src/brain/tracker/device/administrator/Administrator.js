import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Administrator = {
  async Create({device}) {
    return await jsonRpcRequest({
      method: 'DeviceAdministrator.Create',
      request: {device},
    })
  },
}

export default Administrator