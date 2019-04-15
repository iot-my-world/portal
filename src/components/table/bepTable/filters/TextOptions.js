import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Select, MenuItem,
} from '@material-ui/core'
import {
  ExactTextCriterion,
} from 'brain/search/criterion/exact'

const styles = (theme) => ({})

class TextOptions extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      criterion: new ExactTextCriterion({
        field: props.field,
        text: '',
      }),
    }
  }

  handleChange(event) {
    let {
      criterion,
    } = this.state
    const {
      onChange,
    } = this.props

    criterion.text = event.target.value
    this.setState({criterion})

    if (criterion.blank) {
      onChange(criterion.field, undefined)
    } else {
      onChange(criterion.field, criterion)
    }
  }

  render() {
    const {
      criterion,
    } = this.state
    const {
      config,
    } = this.props

    return <div>
      <Select
          value={criterion.text}
          onChange={this.handleChange}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {config.options.map((option, idx) => (
            <MenuItem key={idx} value={option[config.valueAccessor]}>
              {option[config.displayAccessor]}
            </MenuItem>
        ))}
      </Select>
    </div>
  }
}

TextOptions = withStyles(styles)(TextOptions)

TextOptions.propTypes = {
  field: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

TextOptions.defaultProps = {}

export default TextOptions