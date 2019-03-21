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

    console.log('party:', partyIdentifiers,
        partyIdentifiers.map(identifier => identifier.unwrappedPOJO()))

    return {readings: []}
    // let response = await jsonRpcRequest({
    //   method: "TrackingReport.Live",
    //   request: {
    //     partyIdentifiers: partyIdentifiers.map(identifier =>
    //         identifier.unwrappedPOJO()
    //     ),
    //   }
    // })
    //
    // response.readings = readings.readings.map(reading => new Reading(reading))
    // return response
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
