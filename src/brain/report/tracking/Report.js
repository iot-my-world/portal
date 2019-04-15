import {jsonRpcRequest} from 'utilities/network'
import {Reading} from 'brain/tracker/reading'

const Report = {
  /**
   * Get the Live Tracking Report
   * @param partyIdentifiers
   * @returns {Promise<any>}
   * @constructor
   */
  async Live({partyIdentifiers}) {
    let response = await jsonRpcRequest({
      method: 'TrackingReport.Live',
      request: {
        partyIdentifiers,
      },
    })
    response.readings = response.readings.map(reading => new Reading(reading))
    return response
  },

  /**
   * Get the Live Tracking Report
   * @param companyCriteria
   * @param clientCriteria
   * @returns {Promise<any>}
   * @constructor
   */
  Historical({ companyCriteria, clientCriteria }) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: "TrackingReport.Historical",
        request: {
          companyCriteria,
          clientCriteria
        }
      })
        .then(result => {
          resolve(result)
        })
          .catch(error => reject(error))
    })
  }
}
export default Report
