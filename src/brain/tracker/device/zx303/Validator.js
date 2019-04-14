import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  async Validate({zx303, action}) {
    let response = await jsonRpcRequest({
      method: 'ZX303DeviceValidator.Validate',
      request: {zx303, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator