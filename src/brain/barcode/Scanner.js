import {jsonRpcRequest} from 'utilities/network'
import Barcode from './Barcode'

const Scanner = {

  /**
   * @param {string} imageData
   * @returns {Promise<any>}
   */
  async Scan({imageData}) {
    let response = await jsonRpcRequest({
      method: 'BarcodeScanner.Scan',
      request: {
        imageData,
      },
    })
    response.barcode = new Barcode(response.barcode)
    return response
  },
}

export default Scanner