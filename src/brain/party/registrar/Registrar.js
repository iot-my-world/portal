import {jsonRpcRequest} from 'utilities/network'

const Registrar = {
  /**
   * @param {User} request
   * @constructor
   */
  InviteCompanyAdminUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteCompanyAdminUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {User} user
   * @param {string} password
   * @constructor
   */
  RegisterCompanyAdminUser(user, password) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterCompanyAdminUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },

  /**
   * @param {Object} partyIdentifier
   * @constructor
   */
  InviteClientAdminUser(partyIdentifier) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteClientAdminUser',
      request: {
        partyIdentifier: partyIdentifier.toPOJO(),
      },
    })
  },

  /**
   * @param {User} user
   * @param {string} password
   * @constructor
   */
  RegisterClientAdminUser(user, password) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterClientAdminUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },
}

export default Registrar