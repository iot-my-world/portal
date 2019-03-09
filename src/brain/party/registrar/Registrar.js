import {jsonRpcRequest} from 'utilities/network'

const Registrar = {
  /**
   * @param {{user: User}} request
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
   * @param {{user: User, password: string}} request
   * @constructor
   */
  RegisterCompanyAdminUser({user, password}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterCompanyAdminUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },

  /**
   * @param {{user: User}} request
   * @constructor
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
   * @param {{user: User, password: string}} request
   * @constructor
   */
  RegisterCompanyUser({user, password}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterCompanyUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },

  /**
   * @param {{user: User}} request
   * @constructor
   */
  InviteClientAdminUser({user}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.InviteClientAdminUser',
      request: {
        user: user.toPOJO(),
      },
    })
  },

  /**
   * @param {{user: User, password: string}} request
   * @constructor
   */
  RegisterClientAdminUser({user, password}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterClientAdminUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },

  /**
   * @param {{user: User}} request
   * @constructor
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
   * @param {{user: User, password: string}} request
   * @constructor
   */
  RegisterClientUser({user, password}) {
    return jsonRpcRequest({
      method: 'PartyRegistrar.RegisterClientUser',
      request: {
        user: user.toPOJO(),
        password: password,
      },
    })
  },
}

export default Registrar