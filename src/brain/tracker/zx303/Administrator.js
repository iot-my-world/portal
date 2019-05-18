import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ZX303 from 'brain/tracker/zx303/ZX303'

const Administrator = {
  async Create({zx303}) {
    let response = await jsonRpcRequest({
      method: 'ZX303DeviceAdministrator.Create',
      request: {zx303},
    })
    response.zx303 = new ZX303(response.zx303)
    return response
  },

  async UpdateAllowedFields({zx303}) {
    let response = await jsonRpcRequest({
      method: 'ZX303DeviceAdministrator.UpdateAllowedFields',
      request: {zx303},
    })
    response.zx303 = new ZX303(response.zx303)
    return response
  },
}

export default Administrator