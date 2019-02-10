import uuid from 'uuid/v1'
import {MethodFailed, ContactFailed} from 'brain/apiError'

const methodsWithoutAuthorization = [
  'Auth.Login',
]

export default function jsonRpcRequest({url, method, request}) {
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
  console.debug(`API Request: ${body.method} -->`, body.params[0])

  return new Promise((resolve, reject) => {
    fetch(
        url, {
          method: 'POST',
          headers: header,
          mode: 'cors',
          body: JSON.stringify(body),
        },
    ).then(responseObject => {
      return responseObject.json()
    }).then(response => {
      if (response.result) {
        console.debug(`API Response Success: ${body.method} -->`, response.result)
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