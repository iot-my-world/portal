import uuid from 'uuid/v1'
import {MethodFailed, ContactFailed} from 'brain/apiError'
import config from 'react-global-configuration'

const methodsWithoutAuthorization = [
  'Auth.Login',
  'UserAdministrator.ForgotPassword',
]

/**
 * Make a jsonRpc Post Request
 * @param {string} [url]
 * @param {string} method
 * @param {object} request
 * @param {boolean} [verbose]
 * @returns {Promise<any>}
 */
export default async function jsonRpcRequest({url, method, request, verbose}) {
  const id = uuid()
  let header = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  if (!methodsWithoutAuthorization.includes(method)) {
    const accessToken = sessionStorage.getItem('jwt')
    if (accessToken) {
      header.append('Authorization', accessToken)
    } else {
      console.error('access token not found')
    }
  }

  const body = {
    jsonrpc: '2.0',
    method: method,
    params: [request],
    id: id,
  }
  console.debug(`API Request: ${body.method} -->\n`, body.params[0])
  if (verbose) {
    try {
      console.debug('\n', JSON.parse(JSON.stringify(body.params[0])))
      console.debug('\n', JSON.stringify(body.params[0]))
    } catch (e) {
      console.error('error parsing stringified body.params[0]')
    }
  }

  let responseObjectJson
  try {
    const responseObject = await fetch(
      url ? url : config.get('brainAPIUrl'),
      {
        method: 'POST',
        headers: header,
        mode: 'cors',
        body: JSON.stringify(body),
      },
    )
    responseObjectJson = await responseObject.json()
  } catch (e) {
    console.error(`API Failed: ${body.method} -->`, e)
    throw new ContactFailed(e, body.method)
  }

  if (responseObjectJson.result) {
    console.debug(`API Response Success: ${body.method} -->`, responseObjectJson.result)
    return responseObjectJson.result
  } else {
    console.error(`API Response Error: ${body.method} -->`, responseObjectJson.error)
    throw new MethodFailed(responseObjectJson.error, body.method)
  }
}