import React, {Component} from 'react'
import {connect} from 'react-redux'

class ContainerClass extends Component {

  render () {
    return <div>Container class template</div>
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

ContainerClass = connect(
    mapStateToProps,
    {
    }
)(ContainerClass)

export default ContainerClass