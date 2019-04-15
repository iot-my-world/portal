import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {Company} from 'brain/party/company'

const Administrator = {
  async Create({company}) {
    let response = await jsonRpcRequest({
      method: 'CompanyAdministrator.Create',
      request: {
        company,
      },
    })
    response.company = new Company(response.company)
    return response
  },

  async UpdateAllowedFields({company}) {
    let response = await jsonRpcRequest({
      method: 'CompanyAdministrator.UpdateAllowedFields',
      request: {
        company,
      },
    })
    response.company = new Company(response.company)
    return response
  },
}

export default Administrator