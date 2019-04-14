import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Validator = {
  async Validate({device}) {
    return await jsonRpcRequest({
      method: 'DeviceValidator.Validate',
      request: {device},
      verbose: true,
    })
  },
}

export default Validator