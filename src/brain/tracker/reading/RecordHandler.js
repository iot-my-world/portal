import {jsonRpcRequest} from 'utilities/network'

const RecordHandler = {
  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'ReadingRecordHandler.Collect',
        request: {
          criteria: criteria
              ? criteria.map(criterion => criterion.toPOJO())
              : undefined,
          query: query
              ? query.toPOJO()
              : undefined,
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}

export default RecordHandler