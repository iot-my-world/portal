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

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

function useBackendRecordHandlerCollect() {
  const [records, setRecords] = useState([])
  const [collectRequest, setCollectRequest] = useState({
    criteria: [],
    query: new Query(),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {

    }
    fetchData()
  })

  return [{records, loading, error}, setCollectRequest]
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
  const [{records, loading, error}, setCollectRequest] = useBackendRecordHandlerCollect()

  return (
    <div>
      <Card>
        <CardContent>
          stuff
        </CardContent>
      </Card>
    </div>
  )
}

BackendManagement.propTypes = {}

BackendManagement.defaultProps = {}

export default BackendManagement