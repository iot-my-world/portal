import uuid from 'uuid/v1'

const methodsWithoutAuthorization = [
  'Login.Login',
]

export default function jsonRpcRequest({url, method, request}) {
  const id = uuid()
  let header = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  console.log('method ', method)
  if (!methodsWithoutAuthorization.includes(method)) {
    const accessToken = sessionStorage.getItem('access_token')
    if (accessToken) {
      header.append('Authorization', accessToken)
    } else {
      console.error('access token not found')
    }
  }

  let body = JSON.stringify({
    jsonrpc: '2.0',
    method: method,
    params: [request],
    id: id,
  })
  console.debug(method + ' jsonRpcRequest.body: ', JSON.parse(body))

  return new Promise((resolve, reject) => {
    fetch(
        url, {
          method: 'POST',
          headers: header,
          mode: 'cors',
          body: body,
        },
    ).then(responseObject => {
      return responseObject.json()
    }).then(response => {
      console.debug(method + ' jsonRpcRequest.response: ', response)
      if (response.result) {
        console.log(method + ' - success', response.result)
        resolve(response.result)
      } else {
        reject(response.error)
        console.error(method + ' - error: ', response.error)
      }
    }).catch(error => {
      reject(error)
      console.error(method + ' jsonRpcRequest.error: ', error)
    })
  })
}