import jsonRpcRequest from 'utilities/network/jsonRpcRequest'

const Handler = {
  /**
   * @param {Object} userIdentifier - any valid search.identifier
   * @constructor
   */
  GetAllUsersViewPermissions(userIdentifier) {
    return jsonRpcRequest({
      method: 'PermissionHandler.GetAllUsersViewPermissions',
      request: {
        userIdentifier: userIdentifier.toWrapped(),
      },
    })
  },
}

export default Handler