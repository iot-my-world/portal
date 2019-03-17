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
  GetMyParty() {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'PartyAdministrator.GetMyParty',
        request: {},
      }).then(response => {
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
            reject('invalid party type' + response.partyType)
            return
        }
        resolve(response)
      }).catch(error => reject(error))
    })
  },
}

export default Administrator