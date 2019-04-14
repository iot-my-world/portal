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
                gridGap: '20px',
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
                {...rest}
            />
          </div>
      )
    }
  }
}

const StyledAsyncSelect = withStyles(styles, {withTheme: true})(AsyncSelect)

export default StyledAsyncSelect