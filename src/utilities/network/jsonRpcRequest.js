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
 * @param {boolean} verbose
 * @returns {Promise<any>}
 */
export default function jsonRpcRequest({url, method, request, verbose}) {
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

  return new Promise((resolve, reject) => {
    fetch(
        url ? url : config.get('brainAPIUrl'),
        {
          method: 'POST',
          headers: header,
          mode: 'cors',
          body: JSON.stringify(body),
        },
    ).then(responseObject => {
      return responseObject.json()
    }).then(response => {
      if (response.result) {
        console.debug(`API Response Success: ${body.method} -->`,
            response.result)
        resolve(response.result)
      } else {
        console.error(`API Response Error: ${body.method} -->`, response.error)
        reject(new MethodFailed(response.error, body.method))
      }
    }).catch(error => {
      console.error(`API Failed: ${body.method} -->`, error)
      reject(new ContactFailed(error, body.method))
    })
  })
}