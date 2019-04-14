import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Administrator = {
  async Create({device}) {
    return await jsonRpcRequest({
      method: 'ZX303DeviceAdministrator.Create',
      request: {device},
    })
  },
}

export default Administrator