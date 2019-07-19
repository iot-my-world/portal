import {useState, useEffect} from 'react'
import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'
import {Backend} from 'brain/sigfox/backend'

const Validator = {
  serviceProvider: 'SigfoxBackend-Validator',

  /**
   * @param {BackendManagement} backend
   * @param {string} action
   * @returns {Promise<any>}
   * @constructor
   */
  async Validate({backend, action}) {
    let response = await jsonRpcRequest({
      method: `${Validator.serviceProvider}.Validate`,
      request: {backend, action},
    })
    response.reasonsInvalid = new ReasonsInvalid(response.reasonsInvalid)
    return response
  },
}

function useBackendValidatorValidate() {
  const [validateRequest, setValidateRequest] = useState({
    backend: new Backend(),
    action: '',
  })
  const [validateResponse, setValidateResponse] = useState({
    reasonsInvalid: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{
    const post = async () => {
      setLoading(true)
      try {
        setValidateResponse(await Validator.Validate(validateRequest))
      } catch (e) {
        console.error('Error Validating Backend', e)
        setError('Error Validating Backend')
      }
      setLoading(false)
    }
    post()
  })

  return [{validateRequest, validateResponse, loading, error}, setValidateRequest]
}

export default Validator
export {
  useBackendValidatorValidate,
}