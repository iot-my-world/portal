import React from 'react'
import {connect} from 'react-redux'
import Tasks from './Tasks'

let TasksContainer = props => {
  return <Tasks {...props}/>
}

const mapStateToProps = (state) => {
  return {}
}

TasksContainer = connect(
    mapStateToProps,
    {},
)(TasksContainer)

export default TasksContainer