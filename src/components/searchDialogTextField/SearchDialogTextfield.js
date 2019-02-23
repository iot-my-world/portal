import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, TextField, Dialog,
  DialogTitle, DialogContent,
  DialogActions, Button,
} from '@material-ui/core'
import BEPTable from 'components/table/bepTable/BEPTable'
import Query from 'brain/search/Query'

const styles = theme => ({})

class SearchDialogTextField extends Component {
  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleSelectClose = this.handleSelectClose.bind(this)
    this.collect = this.collect.bind(this)
    this.handleCriteriaQueryChange = this.handleCriteriaQueryChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.collectTimeout = () => {
    }
    this.state = {
      value: '',
      open: false,
      isLoading: false,
      selected: {},
      selectedRowIdx: -1,
      records: [],
      totalNoRecords: 0,
    }
  }

  collectCriteria = []
  collectQuery = new Query()

  componentDidMount(){
    this.collect()
  }

  handleOpen() {
    this.setState({open: true})
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleClose() {
    this.setState({open: false})
  }

  handleSelectClose() {
    const {
      id,
      onChange,
    } = this.props
    const {
      selected,
      selectedRowIdx,
    } = this.state
    
    if (selectedRowIdx > 0) {
      this.handleClose()
      return
    }
    
    onChange({
      target: {
        id,
        value: selected,
      },
    })
    this.handleClose()
  }

  handleSelect(rowRecordObj, rowIdx) {
    this.setState({
      selectedRowIdx: rowIdx,
      selected: rowRecordObj,
    })
  }

  async collect() {
    const {
      recordHandler,
    } = this.props

    this.setState({isLoading: true})
    try {
      const collectResponse =
          await recordHandler.Collect(this.collectCriteria, this.collectQuery)
      this.setState({
        records: collectResponse.records,
        totalNoRecords: collectResponse.total,
      })
    } catch (e) {
      console.error(`error collecting records: ${e}`)
    }
    this.setState({isLoading: false})
  }

  handleCriteriaQueryChange(criteria, query) {
    this.collectCriteria = criteria
    this.collectQuery = query
    this.collectTimeout = setTimeout(this.collect, 300)
    this.setState({
      isLoading: false,
      selected: {},
      selectedRowIdx: -1,
    })
  }

  render() {
    const {
      open,
      isLoading,
      selectedRowIdx,
      records,
      totalNoRecords,
    } = this.state
    const {
      recordHandler,
      searchColumns,
      theme,
      ...rest
    } = this.props
    return <React.Fragment>
      <TextField
          {...rest}
          onClick={this.handleOpen}
          inputProps={{readOnly: true}}
      />
      <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{rest.label}</DialogTitle>
        <DialogContent>
          <BEPTable
              loading={isLoading}
              totalNoRecords={totalNoRecords}
              data={records}
              onCriteriaQueryChange={this.handleCriteriaQueryChange}
              columns={searchColumns}
              getTdProps={(state, rowInfo) => {
                const rowIndex = rowInfo ? rowInfo.index : undefined
                return {
                  onClick: (e, handleOriginal) => {
                    if (rowInfo) {
                      this.handleSelect(rowInfo.original, rowInfo.index)
                    }
                    if (handleOriginal) {
                      handleOriginal()
                    }
                  },
                  style: {
                    background: rowIndex === selectedRowIdx ?
                        theme.palette.secondary.light :
                        'white',
                    color: rowIndex === selectedRowIdx ?
                        theme.palette.secondary.contrastText :
                        theme.palette.primary.main,
                  },
                }
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button
              onClick={this.handleSelectClose}
              color='primary'
              variant='contained'
          >
            Select
          </Button>
          <Button
              onClick={this.handleClose}
              color='primary'
              variant='contained'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  }
}

SearchDialogTextField = withStyles(styles, {withTheme: true})(
    SearchDialogTextField)

SearchDialogTextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  searchColumns: PropTypes.array.isRequired,
  recordHandler: PropTypes.any.isRequired,
}
SearchDialogTextField.defaultProps = {}

export default SearchDialogTextField