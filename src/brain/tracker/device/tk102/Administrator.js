import { jsonRpcRequest } from "utilities/network/index";
import TK102 from "./TK102";

const Administrator = {
  /**
   * Change Owner of TK102 device
   * @param tk102
   * @returns {Promise<Tk102>}
   * @constructor
   */
  ChangeOwnershipAndAssignment(tk102) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: "TK102DeviceAdministrator.ChangeOwnershipAndAssignment",
        request: {
          tk102: tk102.toPOJO()
        }
      })
        .then(result => {
          resolve(new TK102(result.tk102));
        })
        .catch(error => reject(error));
    });
  }
};

export default Administrator;
