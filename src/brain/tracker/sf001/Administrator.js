import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import SF001 from 'brain/tracker/sf001/SF001'

const Administrator = {
  async Create({sf001}) {
    let response = await jsonRpcRequest({
      method: 'SF001TrackerAdministrator.Create',
      request: {sf001},
    })
    response.sf001 = new SF001(response.sf001)
    return response
  },

  async UpdateAllowedFields({sf001}) {
    let response = await jsonRpcRequest({
      method: 'SF001TrackerAdministrator.UpdateAllowedFields',
      request: {sf001},
    })
    response.sf001 = new SF001(response.sf001)
    return response
  },
}

export default Administrator