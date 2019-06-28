import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Administrator = {
  serviceProvider: 'Permission-Administrator',

  /**
   * @param {Object} userIdentifier - any valid search.identifier
   * @constructor
   */
  GetAllUsersViewPermissions({userIdentifier}) {
    return jsonRpcRequest({
      method: `${this.serviceProvider}.GetAllUsersViewPermissions`,
      request: {
        userIdentifier,
      },
    })
  },
}

export default Administrator