import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardContent,
  makeStyles,
} from '@material-ui/core'
import {
  Backend,
} from 'brain/sigfox/backend'

const states = {
  nop: 0,
  itemSelected: 1,
}

const events = {
  init: states.nop,
  selectRow: states.itemSelected,
}

const useStyles = makeStyles(theme => ({}))

function BackendManagement(props) {
  const [activeState, setActiveState] = useState(states.nop)
  const [recordCollectionInProgress, setRecordCollectionInProgressState] = useState(false)
  const [records, setRecords] = useState([])
  const [selectedBackend, setSelectedBackend] = useState(new Backend())

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