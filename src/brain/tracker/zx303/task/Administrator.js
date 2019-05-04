import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import Task from './Task'

const Administrator = {
  async Sumbit({zx303Task}) {
    const response = await jsonRpcRequest({
      method: 'ZX303TaskAdministrator.Submit',
      request: {zx303Task},
    })
    response.zx303Task = new Task(zx303Task)
    return response
  },
}

export default Administrator