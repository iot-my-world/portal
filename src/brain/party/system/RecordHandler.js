import { jsonRpcRequest } from "utilities/network";
import System from "./System";

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: "SystemRecordHandler.Collect",
        request: {
          criteria,
          query: query ? query.toPOJO() : undefined
        }
      })
        .then(result => {
          result.records = result.records.map(system => new System(system));
          resolve(result);
        })
        .catch(error => reject(error));
    });
  }
};

export default RecordHandler;
