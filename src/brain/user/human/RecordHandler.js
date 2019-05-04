import {jsonRpcRequest} from 'utilities/network/index'
import User from './User'

const RecordHandler = {
  /**
   * Create a new user
   * @param {User} user
   * @constructor
   */
  Create(user) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'UserRecordHandler.Create',
        request: {
          user,
        },
      }).then(result => {
        resolve(new User(result.user))
      }).catch(error => reject(error))
    })
  },

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'UserRecordHandler.Collect',
        request: {
          criteria,
          query,
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}

export default RecordHandler