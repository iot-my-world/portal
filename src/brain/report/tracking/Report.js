import {jsonRpcRequest} from 'utilities/network'
import ZX303TrackerGPSReading from 'brain/tracker/zx303/reading/gps'

const Report = {
  serviceProvider: 'Tracking-Report',

  /**
   * Get the Live Tracking Report
   * @param partyIdentifiers
   * @returns {Promise<any>}
   * @constructor
   */
  async Live({partyIdentifiers}) {
    let response = await jsonRpcRequest({
      method: `${this.serviceProvider}.Live`,
      request: {
        partyIdentifiers,
      },
    })
    response.zx303TrackerGPSReadings = response.zx303TrackerGPSReadings.map(
      reading => new ZX303TrackerGPSReading(reading),
    )
    return response
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
        method: `${this.serviceProvider}.Historical`,
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
