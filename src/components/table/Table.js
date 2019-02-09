import React from 'react'

import {withStyles} from '@material-ui/core/styles'
import ReactTable from 'react-table'
import ReactTablePropTypes from 'react-table/es/propTypes'

import tableStyle from './Style'
import './Custom.css'

const ReactTableWrapper = (props) => {
  const {classes, getProps, getTheadProps, getTheadTrProps, getTrProps, ...rest} = props

  const getPropsWrapper = (state, rowInfo, column) => {
    let newProps = getProps ? getProps(state, rowInfo, column) : {}
    return {...newProps, className: classes.Table}
  }

  const getTheadPropsWrapper = (state, rowInfo, column) => {
    let newProps = getTheadProps ? getTheadProps(state, rowInfo, column) : {}
    return {...newProps, className: classes.TableHeader}
  }

  const getTheadTrPropsWrapper = (state, rowInfo, column) => {
    let newProps = getTheadTrProps ? getTheadTrProps(state, rowInfo, column) : {}
    return {...newProps, className: classes.TableHeaderRow}
  }

  const getTrPropsWrapper = (state, rowInfo, column) => {
    let newProps = getTrProps ? getTrProps(state, rowInfo, column) : {}
    return {...newProps, className: classes.TableRow}
  }

  return <ReactTable
      getTableProps={getPropsWrapper}
      getTheadProps={getTheadPropsWrapper}
      getTheadTrProps={getTheadTrPropsWrapper}
      getTrProps={getTrPropsWrapper}
      {...rest}
  />
}

const StyledReactTable = withStyles(tableStyle)(ReactTableWrapper)
StyledReactTable.propTypes = ReactTablePropTypes
export default StyledReactTable
