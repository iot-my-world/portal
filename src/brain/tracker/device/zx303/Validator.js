import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Validator = {
  async Validate({zx303}) {
    return await jsonRpcRequest({
      method: 'ZX303DeviceValidator.Validate',
      request: {zx303},
      verbose: true,
    })
  },
}

export default Validator