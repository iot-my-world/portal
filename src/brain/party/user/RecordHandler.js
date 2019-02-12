import {jsonRpcRequest} from 'utilities/network'
import config from 'react-global-configuration'
import User from './User'
import ReasonsInvalid from 'brain/validate/reasonInvalid/ReasonsInvalid'

export default class RecordHandler {

  /**
   * Create a new user
   * @param {User} user
   * @constructor
   */
  static Create(user) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'UserRecordHandler.Create',
        request: {
          user: user.toPOJO(),
        },
      }).then(result => {
        resolve(new User(result.user))
      }).catch(error => reject(error))
    })
  }

  /**
   * Validate a user
   * @param {User} user
   * @param {string} method
   * @constructor
   */
  static Validate(user, method) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'UserRecordHandler.Validate',
        request: {
          user: user.toPOJO(),
          method,
        },
      }).then(result => {
        resolve(new ReasonsInvalid(result.reasonsInvalid))
      }).catch(error => reject(error))
    })
  }

  /**
   * @param {array} criteria
   * @param {Query} query
   * @constructor
   */
  static Collect(criteria, query) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        url: config.get('brainAPIUrl'),
        method: 'UserRecordHandler.Collect',
        request: {
          criteria: criteria.map(criterion => criterion.toPOJO()),
          query: query.toPOJO(),
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  }
}