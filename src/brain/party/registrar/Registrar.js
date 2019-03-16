import {jsonRpcRequest} from 'utilities/network'

const Registrar = {
  /**
   * @param {{companyIdentifier: object}} request
   */
  InviteCompanyAdminUser({companyIdentifier}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteCompanyAdminUser',
      request: {
        companyIdentifier: companyIdentifier.toPOJO(),
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
  InviteCompanyUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteCompanyUser',
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
        clientIdentifier: clientIdentifier.toPOJO(),
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
  InviteClientUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteClientUser',
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
   * @param {{partyDetails: []}} request
   */
  AreAdminsRegistered({partyDetails}){
    return jsonRpcRequest({
      method: 'PartyRegistrar.AreAdminsRegistered',
      request: {
        partyDetails,
      },
    })
  }
}

export default Registrar