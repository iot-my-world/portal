import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, TextField, Dialog,
  DialogTitle, DialogContent,
  DialogActions, Button,
} from '@material-ui/core'

const styles = theme => ({})

class SearchDialogTextField extends Component {
  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCancelClose = this.handleCancelClose.bind(this)
    this.handleSelectClose = this.handleSelectClose.bind(this)
    this.state = {
      value: '',
      open: false,
    }
  }

  handleOpen(){
    this.setState({open: true})
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleCancelClose() {

  }

  handleSelectClose() {
    
  }

  render() {
    const {
      value,
      open,
    } = this.state
    const {
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
          onClose={this.handleCancelClose}
          aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{rest.label}</DialogTitle>
        <DialogContent>
          <TextField
              value={value}
              onChange={this.handleChange}
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
              onClick={this.handleCancelClose}
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

SearchDialogTextField = withStyles(styles)(SearchDialogTextField)

SearchDialogTextField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
SearchDialogTextField.defaultProps = {}

export default SearchDialogTextField