import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Administrator = {
  async Create({zx303}) {
    return await jsonRpcRequest({
      method: 'ZX303DeviceAdministrator.Create',
      request: {zx303},
    })
  },
}

export default Administrator