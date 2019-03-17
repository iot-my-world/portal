import React, {Component} from 'react'
import ReactAsyncSelect from 'react-select/lib/Async'
import {withStyles, TextField as MUITextField} from '@material-ui/core'

const styles = theme => ({})

const Input = props => {
  const {
    cx,
    children,
    getStyles,
    innerRef,
    selectProps,
    isHidden,
    isDisabled,
    ExtraTextFieldProps,
    ...rest
  } = props

  console.log('ExtraTextFieldProps', ExtraTextFieldProps)
  return <MUITextField
      {...rest}
      {...ExtraTextFieldProps}
  />
}

const InputExtraProps = ExtraTextFieldProps => {
  if (ExtraTextFieldProps) {
    return props => Input({...props, ExtraTextFieldProps})
  } else {
    return props => Input({...props, ExtraTextFieldProps: {}})
  }
}

const asyncSelectStyles = theme => ({
  control: styles => ({
    ...styles,
    width: '150px',
    fontFamily: theme.typography.fontFamily,
    border: 0,
  }),
  option: styles => ({
    ...styles,
    fontFamily: theme.typography.fontFamily,
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontFamily: theme.typography.fontFamily,
  }),
})

class AsyncSelect extends Component {
  constructor(props) {
    super(props)
    this.asyncSelectStyles = asyncSelectStyles(props.theme)
  }

  render() {
    const {
      ExtraTextFieldProps,
      ...rest
    } = this.props
    return (
        <ReactAsyncSelect
            styles={this.asyncSelectStyles}
            components={{Input: InputExtraProps(ExtraTextFieldProps)}}
            {...rest}
        />
    )
  }
}

const StyledAsyncSelect = withStyles(styles, {withTheme: true})(AsyncSelect)

export default StyledAsyncSelect