import {jsonRpcRequest} from 'utilities/network'

const Registrar = {
  serviceProvider: 'Party-Registrar',

  /**
   * @param {{companyIdentifier: object}} request
   */
  async InviteCompanyAdminUser({companyIdentifier}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.InviteCompanyAdminUser`,
      request: {
        companyIdentifier,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  async RegisterCompanyAdminUser({user}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.RegisterCompanyAdminUser`,
      request: {
        user,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  async RegisterCompanyUser({user}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.RegisterCompanyUser`,
      request: {
        user,
      },
    })
  },

  /**
   * @param {{clientIdentifier: object}} request
   */
  async InviteClientAdminUser({clientIdentifier}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.InviteClientAdminUser`,
      request: {
        clientIdentifier: clientIdentifier,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  async RegisterClientAdminUser({user}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.RegisterClientAdminUser`,
      request: {
        user,
      },
    })
  },

  /**
   * @param {{user: User}} request
   */
  async RegisterClientUser({user}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.RegisterClientUser`,
      request: {
        user,
      },
    })
  },

  /**
   * @param {{partyIdentifiers: [Party]}} request
   */
  async AreAdminsRegistered({partyIdentifiers}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.AreAdminsRegistered`,
      request: {
        partyIdentifiers,
      },
    })
  },

  async InviteUser({userIdentifier}) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.InviteUser`,
      request: {
        userIdentifier,
      },
    })
  },
}

export default Registrar