import {jsonRpcRequest} from 'utilities/network/index'
import {useState, useEffect} from 'react'
import Backend from './Backend'
import Query from 'brain/search/Query'
import {BackendRecordHandler} from 'brain/sigfox/backend/index'

const RecordHandler = {
  serviceProvider: 'SigfoxBackend-RecordHandler',

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
    response.records = response.records.map(backend => new Backend(backend))
    return response
  },
}

export default RecordHandler

function useBackendRecordHandlerCollect() {
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
  const [collectTimeout, setCollectTimeout] = useState(()=>{})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        setCollectResponse(await BackendRecordHandler.Collect(collectRequest))
      } catch (e) {
        console.error('Error Collecting Backend Records', e)
        setError('Error Collecting Backend Records')
      }
      setLoading(false)
    }
    clearTimeout(collectTimeout)
    setCollectTimeout(setTimeout(fetchData, 300))
  }, [collectRequest])

  return [{collectRequest, collectResponse, loading, error}, setCollectRequest]
}

export {
  useBackendRecordHandlerCollect,
}