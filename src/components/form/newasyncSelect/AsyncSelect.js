import React, {Component} from 'react'
import ReactAsyncSelect from 'react-select/lib/Async'
import {withStyles, TextField, Typography} from '@material-ui/core'

const styles = theme => ({
  formField: {
    height: '60px',
    width: '150px',
  },
  label: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 10,
  },
})

const asyncSelectStyles = theme => ({
  valueContainer: styles => ({
    ...styles,
    border: 'none',
    // padding: '0 4px',
  }),
  dropdownIndicator: styles => ({
    ...styles,
    // padding: '6px',
  }),
  option: styles => ({
    ...styles,
    fontFamily: theme.typography.fontFamily,
  }),
  control: styles => ({
    ...styles,
    width: '150px',
    fontFamily: theme.typography.fontFamily,
    border: 'none',
    borderBottom: `1px solid ${theme.palette.grey[600]}`,
    boxShadow: 0,
    minHeight: '1px',
    padding: '0',
    borderRadius: '0',
    backgroundColor: 'none',
  }),
  input: styles => ({
    ...styles,
    padding: '0',
    margin: '0',
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

  onChange(selectionInfo) {
    const {
      onChange,
      id,
    } = this.props

    onChange({
      target: {
        id,
        value: selectionInfo.value,
      },
      selectionInfo,
    })
  }

  render() {
    const {
      onChange,
      value,
      readOnly,
      classes,
      helperText,
      error,
      label,
      ...rest
    } = this.props
    if (readOnly) {
      return <TextField
          label={label}
          className={classes.formField}
          value={value.label}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
          }}
          helperText={helperText}
          error={error}
          {...rest}
      />
    } else {
      return (
          <div
              style={{
                height: error ? '45px' : '31px',
                display: 'grid',
                gridGap: '16px',
                gridTemplateRows: 'auto auto',
                gridTemplateColumns: 'auto',
                // marginLeft: '40px',
                // marginRight: '40px',
              }}
          >
            <div className={classes.label}>
              {label}
            </div>
            <ReactAsyncSelect
                styles={this.asyncSelectStyles}
                onChange={this.onChange}
                value={value}
                defaultOptions={[
                  {
                    value: '',
                    label: 'Start typing to search..',
                  }]}
                {...rest}
            />
          </div>
      )
    }
  }
}

const StyledAsyncSelect = withStyles(styles, {withTheme: true})(AsyncSelect)

export default StyledAsyncSelect