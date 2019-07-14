import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
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

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
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
      try {
        setLoading(true)
        setCollectResponse(await BackendRecordHandler.Collect(collectRequest))
      } catch (e) {
        console.error('error collecting backend records', e)
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
const companyRegistration = {}

function BackendManagement(props) {
  const [activeState, setActiveState] = useState(states.nop)
  const [selectedBackend, setSelectedBackend] = useState(new Backend())
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [{collectResponse, loading, error}, setCollectRequest] = useBackendRecordHandlerCollect()

  useEffect(() => setCollectRequest({
    records: [],
    total: 0,
  }), [])

  return (
    <div>
      <Card>
        <CardContent>
          <BEPTable
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
            handleRowSelect={() => {
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

BackendManagement.propTypes = {}

BackendManagement.defaultProps = {}

export default BackendManagement