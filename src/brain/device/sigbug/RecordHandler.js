import {jsonRpcRequest} from 'utilities/network/index'
import {useState, useEffect} from 'react'
import Sigbug from './Sigbug'
import Query from 'brain/search/Query'

const RecordHandler = {
  serviceProvider: 'Sigbug-RecordHandler',

  /**
   * @param {array} [criteria]
   * @param {Query} [query]
   * @constructor
   */
  async Collect({criteria, query}) {
    let response = await jsonRpcRequest({
      method: `${RecordHandler.serviceProvider}.Collect`,
      request: {
        criteria,
        query,
      },
    })
    response.records = response.records.map(sigbug => new Sigbug(sigbug))
    return response
  },
}

export default RecordHandler

let collectTimeout = null

function useSigbugRecordHandlerCollect() {
  const [collectResponse, setCollectResponse] = useState({
    records: [],
    total: 0,
  })
  const [collectRequest, setCollectRequest] = useState({
    criteria: [],
    query: new Query(),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        setCollectResponse(await RecordHandler.Collect(collectRequest))
      } catch (e) {
        console.error('Error Collecting Sigbug Records', e)
        setError('Error Collecting Sigbug Records')
      }
      setLoading(false)
    }
    clearTimeout(collectTimeout)
    collectTimeout = setTimeout(fetchData, 300)
  }, [collectRequest])

  return [{collectRequest, collectResponse, loading, error}, setCollectRequest]
}

export {
  useSigbugRecordHandlerCollect,
}