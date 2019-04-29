import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  async Validate({zx303Task, action}) {
    let response = await jsonRpcRequest({
      method: 'ZX303TaskValidator.Validate',
      request: {zx303Task, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator