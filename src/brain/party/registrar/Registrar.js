import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'

export default class Registrar {
  /**
   * @param {Object} partyIdentifier
   * @constructor
   */
  static InviteCompanyAdminUser(partyIdentifier) {
    return jsonRpcRequest({
      url: config.get('brainAPIUrl'),
      method: 'PartyRegistrar.InviteCompanyAdminUser',
      request: {
        partyIdentifier: partyIdentifier.toPOJO(),
      },
    })
  }
}