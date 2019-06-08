import { jsonRpcRequest } from "utilities/network";
import System from "./System";

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    let collectResponse = await jsonRpcRequest({
      method: "SystemRecordHandler.Collect",
      request: {
        criteria,
        query,
      }
    })
    collectResponse.records = collectResponse.records.map(system => new System(system))
    return collectResponse
  }
};

export default RecordHandler;
