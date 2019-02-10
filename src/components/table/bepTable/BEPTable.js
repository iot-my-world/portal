import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Table from 'components/table/reactTable/Table'
import {withStyles} from '@material-ui/core'

const styles = theme => ({
})

const errorStates = {
  constructingTable: 'Error Constructing Table',
}

const processingStates = {
  constructingTable: 'Constructing Table',
}

const states = {
  nop: 0,

  // construction states
  constructingTable: processingStates.constructingTable,
  errorConstructingTable: errorStates.constructingTable,
}

const events = {
  init: states.constructingTable,

  // construction events
  constructionError: states.errorConstructingTable,
  tableConstructionFinish: states.nop,
}

class BEPTable extends Component {
  state = {
    activeState: events.init,
    errors: {},
  }
}

BEPTable = withStyles(styles)(BEPTable)

BEPTable.propTypes = {

}

BEPTable.defaultProps = {

}

export default BEPTable

