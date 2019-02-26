import {jsonRpcRequest} from 'utilities/network'

const RecordHandler = {
  /**
   * @param {array} criteria
   * @param {Query} query
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'SystemRecordHandler.Collect',
        request: {
          criteria: criteria.map(criterion => criterion.toPOJO()),
          query: query.toPOJO(),
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}

export default RecordHandler