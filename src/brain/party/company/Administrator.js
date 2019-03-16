import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {Company} from 'brain/party/company'

const Administrator = {
  async UpdateAllowedFields({company}) {
    let response = await jsonRpcRequest({
      method: 'CompanyAdministrator.UpdateAllowedFields',
      request: {
        company: company.toPOJO(),
      },
    })
    response.company = new Company(response.company)
    return response
  },
}

export default Administrator