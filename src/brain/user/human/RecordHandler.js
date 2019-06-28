import {jsonRpcRequest} from 'utilities/network/index'
import User from './User'

const RecordHandler = {
  serviceProvider: 'HumanUser-RecordHandler',

  /**
   * Create a new user
   * @param {User} user
   * @constructor
   */
  async Create(user) {
    const response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Create`,
      request: {
        user,
      },
    })
    return new User(response.user)
  },

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect(criteria, query) {
    return await jsonRpcRequest({
      method: `${this.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
  },
}

export default RecordHandler