import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Input,
} from '@material-ui/core'
import {
  TextCriterion,
} from 'brain/search/criterion'

const styles = (theme) => ({})

class Text extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      criterion: new TextCriterion({
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

    return <div>
      <Input
          disableUnderline={true}
          onChange={this.handleChange}
          value={criterion.text}
      />
    </div>
  }
}

Text = withStyles(styles)(Text)

Text.propTypes = {
  field: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

Text.defaultProps = {}

export default Text