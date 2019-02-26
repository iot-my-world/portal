import {jsonRpcRequest} from 'utilities/network/index'
import TK102 from './TK102'

const Administrator = {
  /**
   * Change Owner of TK102 device
   * @param tk102Identifier
   * @param newOwnerPartyType
   * @param newOwnerIdentifier
   * @returns {Promise<any>}
   * @constructor
   */
  ChangeOwner(tk102Identifier, newOwnerPartyType, newOwnerIdentifier) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceAdministrator.ChangeOwner',
        request: {
          tk102Identifier: tk102Identifier.toWrapped(),
          newOwnerPartyType,
          newOwnerIdentifier: newOwnerIdentifier.toWrapped(),
        },
      }).then(result => {
        resolve(new TK102(result.tk102))
      }).catch(error => reject(error))
    })
  },

  /**
   * Change Owner of TK102 device
   * @param tk102Identifier
   * @param newAssignedPartyType
   * @param newAssignedIdentifier
   * @returns {Promise<any>}
   * @constructor
   */
  ChangeAssigned(tk102Identifier, newAssignedPartyType, newAssignedIdentifier) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TK102DeviceAdministrator.ChangeAssigned',
        request: {
          tk102Identifier: tk102Identifier.toWrapped(),
          newAssignedPartyType,
          newAssignedIdentifier: newAssignedIdentifier.toWrapped(),
        },
      }).then(result => {
        resolve(new TK102(result.tk102))
      }).catch(error => reject(error))
    })
  },
}

export default Administrator