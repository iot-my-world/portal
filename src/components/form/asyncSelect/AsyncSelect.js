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
    border: `0px solid #ffffff`,
    boxShadow: 0,
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
    this.onChange = this.onChange.bind(this)
    this.asyncSelectStyles = asyncSelectStyles(props.theme)
  }

  onChange(selectionInfo, actionInfo) {
    const {
      onChange,
    } = this.props
    onChange({
      target: {
        id: actionInfo.name,
        value: selectionInfo.value,
      },
    })
  }

  render() {
    const {
      ExtraTextFieldProps,
      onChange,
      ...rest
    } = this.props
    return (
        <ReactAsyncSelect
            styles={this.asyncSelectStyles}
            components={{Input: InputExtraProps(ExtraTextFieldProps)}}
            onChange={this.onChange}
            {...rest}
        />
    )
  }
}

const StyledAsyncSelect = withStyles(styles, {withTheme: true})(AsyncSelect)

export default StyledAsyncSelect