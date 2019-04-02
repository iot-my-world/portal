import {jsonRpcRequest} from 'utilities/network'

const Registrar = {
  /**
   * @param {{companyIdentifier: object}} request
   */
  InviteCompanyAdminUser({companyIdentifier}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteCompanyAdminUser',
      request: {
        companyIdentifier: companyIdentifier,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  RegisterCompanyAdminUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterCompanyAdminUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  RegisterCompanyUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterCompanyUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {{clientIdentifier: object}} request
   */
  InviteClientAdminUser({clientIdentifier}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteClientAdminUser',
      request: {
        clientIdentifier: clientIdentifier,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  RegisterClientAdminUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterClientAdminUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  RegisterClientUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterClientUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {{partyIdentifiers: [Party]}} request
   */
  AreAdminsRegistered({partyIdentifiers}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.AreAdminsRegistered',
      request: {
        partyIdentifiers,
      },
    })
  },

  async InviteUser({userIdentifier}) {
    return await jsonRpcRequest({
      method: 'PartyRegistrar.InviteUser',
      request: {
        userIdentifier: userIdentifier,
      },
    })
  },
}

export default Registrar