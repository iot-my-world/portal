import {jsonRpcRequest} from 'utilities/network'

const Report = {
  /**
   * Get the Live Tracking Report
   * @param companyCriteria
   * @param clientCriteria
   * @returns {Promise<any>}
   * @constructor
   */
  Live({companyCriteria, clientCriteria}) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TrackingReport.Live',
        request: {
          companyCriteria,
          clientCriteria
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },

  /**
   * Get the Live Tracking Report
   * @param companyCriteria
   * @param clientCriteria
   * @returns {Promise<any>}
   * @constructor
   */
  Historical({companyCriteria, clientCriteria}) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TrackingReport.Historical',
        request: {
          companyCriteria,
          clientCriteria
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}
export default Report