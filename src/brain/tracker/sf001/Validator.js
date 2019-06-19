import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

const Validator = {
  async Validate({sf001, action}) {
    let response = await jsonRpcRequest({
      method: 'SF001TrackerValidator.Validate',
      request: {sf001, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

export default Validator