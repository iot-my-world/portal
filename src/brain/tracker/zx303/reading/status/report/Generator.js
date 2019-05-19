import {jsonRpcRequest} from 'utilities/network/index'
import {ZX303BatteryStatusReport} from 'brain/tracker/zx303/reading/status/report'

const Generator = {
  /**
   * @param {Object} [zx303TrackerIdentifier]
   * @constructor
   */
  async BatteryReport({zx303TrackerIdentifier}) {
    let response = await jsonRpcRequest({
      method: 'ZX303StatusReadingReportGenerator.BatteryReport',
      request: {zx303TrackerIdentifier},
    })
    response.report = new ZX303BatteryStatusReport(response.report)
    return response
  },
}

export default Generator