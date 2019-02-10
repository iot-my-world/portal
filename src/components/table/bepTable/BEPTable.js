import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Table from 'components/table/reactTable/Table'
import {
  withStyles, CircularProgress, Typography,
} from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import {isString, isObject, isArray} from 'utilities/type/type'
import {
  Text as TextFilter,
} from './filters'
import {
  Text as TextCriterionType,
} from 'brain/search/criterion/types'
import {Query} from 'brain/search'

const styles = theme => ({
  processingDisplay: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyItems: 'center',
    margin: '15px',
  },
  errorDisplay: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyItems: 'center',
    margin: '15px',
  },
  progress: {
    margin: 2,
  },
  errorIcon: {
    fontSize: 80,
  },
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

  criteria = {}
  query = new Query()
  columns = []

  constructor(props) {
    super(props)
    this.renderError = this.renderError.bind(this)
    this.renderProcessing = this.renderProcessing.bind(this)
    this.constructTable = this.constructTable.bind(this)
    this.constructColumns = this.constructColumns.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleQuerySortChange = this.handleQuerySortChange.bind(this)
    this.handleQueryLimitChange = this.handleQueryLimitChange.bind(this)
    this.handleQueryOffsetChange = this.handleQueryOffsetChange.bind(this)
  }

  componentDidMount() {
    this.constructTable()
  }

  constructTable() {
    const {
      errors,
    } = this.state
    try {
      this.constructColumns()
      this.setState({activeState: events.tableConstructionFinish})
    } catch (e) {
      console.error(`error constructing table: ${e}`)
      this.setState({
        activeState: events.constructionError,
        errors: {
          ...errors,
          [events.constructionError]: e,
        },
      })
    }
  }

  constructColumns() {
    const {
      columns,
    } = this.props

    BEPTable.validateColumns(columns)

    this.columns = []
    for (let col of columns) {
      // if neither id nor accessor are strings then no filter
      // or filter state will be built
      if (!(
          isString(col.id) || isString(col.accessor)
      )) {
        this.columns.push(col)
        continue
      }

      // check if filtering on this column is disallowed
      if (col.filterable === false) {
        // if so, add and continue
        this.columns.push(col)
        continue
      }

      // the rest of the columns have either an id or an accessor and
      // as such will have a filter added for them
      const columnId = isString(col.id) ? col.id : col.accessor

      if (col.config.filter === undefined) {
        // if filterConfig not passed for a column
        // the default filter created is text
        col.Filter = () => <TextFilter
            field={columnId}
            config={col.config.filter}
            onChange={this.handleFilterChange}
        />
      } else {
        // col.config.filter not undefined
        switch (col.config.filter.type) {
          case TextCriterionType:
            col.Filter = () => <TextFilter
                field={columnId}
                config={col.config.filter}
                onChange={this.handleFilterChange}
            />
            break

          default:
            throw new TypeError(`invalid column.filter.config.type: ${col.config.filter.type}`)
        }
      }
      this.columns.push(col)
    }
  }

  handleFilterChange(field, newFilter) {
    const {
      onCriteriaChange,
    } = this.props
    this.criteria[field] = newFilter
    let updatedCriteria = []
    for (field in this.criteria) {
      if (this.criteria[field] !== undefined) {
        updatedCriteria.push(this.criteria[field])
      }
    }
    onCriteriaChange(updatedCriteria)
  }

  handleQuerySortChange(updatedSortObjects) {
    const {
      onQueryChange,
    } = this.props
    this.query.sortBy = []
    this.query.order = []

    for (let sortObj of updatedSortObjects) {
      this.query.sortBy.push(sortObj.id)
      this.query.order.push(
          sortObj.desc ? Query.SortOrderDescending : Query.SortOrderAscending)
    }
    onQueryChange(new Query(this.query))
  }

  handleQueryLimitChange(newPageSize) {
    const {
      onQueryChange,
    } = this.props
    this.query.limit = newPageSize
    onQueryChange(new Query(this.query))
  }

  handleQueryOffsetChange(newPageIndex) {
    const {
      onQueryChange,
    } = this.props
    this.query.offset = newPageIndex * this.query.limit
    onQueryChange(new Query(this.query))
  }

  render() {
    const {
      activeState,
    } = this.state
    const {
      classes,
      totalNoRecords,
      ...rest
    } = this.props

    switch (true) {
      case activeState === states.nop:
        return <Table
            {...rest}
            filterable
            columns={this.columns}
            manual={true}
            pages={Math.ceil(totalNoRecords / this.query.limit)}
            defaultPageSize={this.query.limit}
            onSortedChange={this.handleQuerySortChange}
            onPageSizeChange={this.handleQueryLimitChange}
            onPageChange={this.handleQueryOffsetChange}
        />
      case Object.values(processingStates).includes(activeState):
        return this.renderProcessing()
      case Object.values(errorStates).includes(activeState):
        return this.renderError()
      default:
        return this.renderError('Invalid Table State')
    }
  }

  renderProcessing() {
    const {activeState} = this.state
    const {classes} = this.props

    return <div className={classes.processingDisplay}>
      <div>
        <Typography>
          <b>{activeState}</b>
        </Typography>
      </div>
      <div>
        <CircularProgress
            className={classes.progress}
        />
      </div>
    </div>
  }

  renderError(outOfStateError) {
    const {activeState, errors} = this.state
    const {classes} = this.props
    const error = errors[activeState]

    let errorMsg = 'Unknown Error'
    if (outOfStateError) {
      errorMsg = outOfStateError
    } else if (isObject(error)) {
      if (error.message) {
        errorMsg = error.message
      }
    } else if (isString(error)) {
      errorMsg = error
    } else if (error !== undefined) {
      errorMsg = error.toString()
    }

    return <div className={classes.errorDisplay}>
      <div>
        <Typography color={'error'}>
          <b>{activeState}</b>
        </Typography>
      </div>
      <div>
        <ErrorIcon
            color={'error'}
            className={classes.errorIcon}
        />
      </div>
      <div>
        <Typography color={'error'}>
          {errorMsg}
        </Typography>
      </div>
    </div>
  }

  static validateColumns(columns) {
    if (!isArray(columns)) {
      throw new TypeError('columns prop passed to PGTable is not an array')
    }

    let headers = []

    for (let column of columns) {
      // every column entry in columns must be an object
      if (!isObject(column)) {
        throw new TypeError(
            `one item in columns array prop passed to PGTable is not an object: ${column}`)
      }

      // if Header is undefined or a blank string (i.e. '') then the column is not considered in column config
      if (
          (column.Header === undefined) ||
          (column.Header === '')
      ) {
        continue
      }

      // column Headers must be strings
      if (!isString(column.Header)) {
        throw new TypeError(
            `one item in columns array prop passed to PGTable has a Header which is not a string: ${column.Header}`)
      }

      // otherwise we must confirm that no 2 headers have the same value
      if (headers.includes(column.Header)) {
        throw new Error(
            `entries in columns prop passed to PGTable with duplicate Header values: ${column.Header}`)
      }
      // add to headers array to check against subsequent
      headers.push(column.Header)

      if (
          // either accessor or id must be a string
          !(
              isString(column.accessor) ||
              isString(column.id)
          )
      ) {
        throw new TypeError(
            `either the 'column.accessor' or 'column.id' must be a string`)
      }
    }
  }
}

BEPTable = withStyles(styles)(BEPTable)

BEPTable.propTypes = {
  /**
   * function which will be called with an array of new
   * criteria objects when any of the filters are changed
   */
  onCriteriaChange: PropTypes.func.isRequired,
  /**
   * function which will be called with new query object
   * when any of the query parameters are changes.
   * i.e. sort, page no. or page size
   */
  onQueryChange: PropTypes.func.isRequired,
  /**
   * Indicates total number of given records on back-end.
   * Used to calculate total no of pages
   */
  totalNoRecords: PropTypes.number.isRequired,
  ...Table.propTypes,
}

BEPTable.defaultProps = {}

export default BEPTable

