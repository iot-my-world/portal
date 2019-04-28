import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import Task from './Task'

const Administrator = {
  async Create({task}) {
    return await jsonRpcRequest({
      method: 'TaskDeviceAdministrator.Create',
      request: {task},
    })
  },

  async UpdateAllowedFields({task}) {
    let response = await jsonRpcRequest({
      method: 'ZX303TaskAdministrator.UpdateAllowedFields',
      request: {task},
    })
    response.task = new Task(response.task)
    return response
  },
}

export default Administrator