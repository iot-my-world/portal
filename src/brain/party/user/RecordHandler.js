import {jsonRpcRequest} from 'utilities/network'
import User from './User'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

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
          user: user.toPOJO(),
        },
      }).then(result => {
        resolve(new User(result.user))
      }).catch(error => reject(error))
    })
  },

  /**
   * Validate a user
   * @param {User} user
   * @param {string} method
   * @constructor
   */
  Validate(user, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'UserRecordHandler.Validate',
        request: {
          user: user.toPOJO(),
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  },

  /**
   * @param {array} criteria
   * @param {Query} query
   * @constructor
   */
  Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'UserRecordHandler.Collect',
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