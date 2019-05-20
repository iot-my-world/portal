import {jsonRpcRequest} from 'utilities/network/index'
import {ZX303BatteryStatusReport} from 'brain/tracker/zx303/reading/status/report'

const Generator = {
  /**
   * @param {number} [endDate]
   * @param {number} [startDate]
   * @param {Object} [zx303TrackerIdentifier]
   * @constructor
   */
  async BatteryReport({zx303TrackerIdentifier, startDate, endDate}) {
    let response = await jsonRpcRequest({
      method: 'ZX303StatusReadingReportGenerator.BatteryReport',
      request: {
        zx303TrackerIdentifier,
        startDate,
        endDate,
      },
    })
    response.report = new ZX303BatteryStatusReport(response.report)
    return response
  },
}

export default Generator