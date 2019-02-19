import jsonRpcRequest from 'utilities/network/jsonRpcRequest'
import config from 'react-global-configuration'

export default class Handler {
  /**
   * @param {Object} userIdentifier - any valid search.identifier
   * @constructor
   */
  static GetAllUsersViewPermissions(userIdentifier) {
    return jsonRpcRequest({
      url: config.get('brainAPIUrl'),
      method: 'PermissionHandler.GetAllUsersViewPermissions',
      request: {
        userIdentifier: userIdentifier.toWrapped(),
      },
    })
  }
}