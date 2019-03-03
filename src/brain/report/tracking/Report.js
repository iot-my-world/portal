import {jsonRpcRequest} from 'utilities/network'
import {Reading} from 'brain/tracker/reading'

const Report = {
  /**
   * Get the Live Tracking Report
   * @param companyIdentifiers
   * @param clientIdentifiers
   * @returns {Promise<any>}
   * @constructor
   */
  Live({companyIdentifiers, clientIdentifiers}) {
    return new Promise((resolve, reject) => {
      jsonRpcRequest({
        method: 'TrackingReport.Live',
        request: {
          companyIdentifiers: companyIdentifiers
              ? companyIdentifiers.map(identifier => identifier.toPOJO())
              : undefined,
          clientIdentifiers: clientIdentifiers
              ? clientIdentifiers.map(identifier => identifier.toPOJO())
              : undefined,
        },
      }).then(result => {
        result.readings = result.readings.map(reading => new Reading(reading))
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
          clientCriteria,
        },
      }).then(result => {
        resolve(result)
      }).catch(error => reject(error))
    })
  },
}
export default Report