import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  withStyles, Input,
} from '@material-ui/core'
import {
  Text as TextCriterion,
} from 'brain/search/criterion'

const styles = (theme) => ({})

class Text extends Component {
  state = {
    criterion: new TextCriterion(),
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    let {
      criterion,
    } = this.state
    criterion.text = event.target.value
    this.setState({criterion})
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

Text.propTypes = {}

Text.defaultProps = {}

export default Text