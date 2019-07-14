import React, {useState, useEffect, useReducer} from 'react'
import {
  Card, CardContent,
  makeStyles,
} from '@material-ui/core'
import {
  Backend, BackendRecordHandler,
} from 'brain/sigfox/backend'
import PartyHolder from 'brain/party/holder/Holder'
import Query from 'brain/search/Query'
import BEPTable from 'components/table/bepTable/BEPTable'
import {TextCriterionType} from 'brain/search/criterion/types'

const states = {
  nop: 0,
  itemSelected: 1,
}

const actionTypes = {
  init: 0,
  selectRow: 1,
}

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
    fetchData()
  }, [collectRequest])

  return [{collectResponse, loading, error}, setCollectRequest]
}

const useStyles = makeStyles(theme => ({}))

const partyHolder = new PartyHolder()
const collectTimeout = () => {
}

function initialState() {
  return {
    activeState: states.nop,
    selectedBackend: new Backend(),
    detailDialogOpen: false,
  }
}

function stateReducer(state, action) {
  switch (action.type) {
    case actionTypes.selectRow:
      return {
        activeState: states.itemSelected,
        selectedBackend: new Backend(action.selectedBackend),
        detailDialogOpen: false,
      }

    case actionTypes.init:
    default:
      return initialState()
  }
}

function BackendManagement(props) {
  const [{collectResponse, loading, error}, setCollectRequest] = useBackendRecordHandlerCollect()
  const [state, actionDispatcher] = useReducer(
    stateReducer,
    initialState(),
  )

  useEffect(() => setCollectRequest({
    records: [],
    total: 0,
  }), [])

  return (
    <div>
      <Card>
        <CardContent>
          <BEPTable
            error={error}
            loading={loading}
            totalNoRecords={collectResponse.total}
            noDataText={'No Backends Found'}
            data={collectResponse.records}
            onCriteriaQueryChange={(criteria, query) => setCollectRequest({
              criteria,
              query,
            })}
            additionalControls={[]}
            columns={[
              {
                Header: 'Name',
                accessor: 'name',
                width: 155,
                config: {
                  filter: {
                    type: TextCriterionType,
                  },
                },
              },
            ]}
            handleRowSelect={selectedBackend => actionDispatcher({
              type: actionTypes.selectRow,
              selectedBackend,
            })}
          />
        </CardContent>
      </Card>
    </div>
  )
}

BackendManagement.propTypes = {}

BackendManagement.defaultProps = {}

export default BackendManagement