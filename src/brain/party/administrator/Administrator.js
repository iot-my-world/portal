import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import {
  CompanyPartyType,
  SystemPartyType,
  ClientPartyType,
} from 'brain/party/types'
import {Company} from 'brain/party/company'
import {Client} from 'brain/party/client'
import {System} from 'brain/party/system'

const Administrator = {
  serviceProvider: 'Party-Administrator',
  async GetMyParty() {
    const response = await
      jsonRpcRequest({
        method: `${this.serviceProvider}.GetMyParty`,
        request: {},
      })
    switch (response.partyType) {
      case SystemPartyType:
        response.party = new System(response.party)
        break

      case CompanyPartyType:
        response.party = new Company(response.party)
        break

      case ClientPartyType:
        response.party = new Client(response.party)
        break

      default:
        throw new TypeError('invalid party type' + response.partyType)
    }
  },
}

export default Administrator