import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {withStyles} from '@material-ui/core'
import ToastNotify from '../../components/notification/ToastNotify'

const styles = theme => ({
  
})

class Root extends Component {
  constructor (props) {
    super(props)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.state = {
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
  }
  updateDimensions(){
    this.setState({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth
    })
  }

  render() {

    return  <BrowserRouter>
      <div>
        <div>
          <Switch>
            <Route
                path='/'
                render={(props) => {
                  return <div>aweh</div>
                }}
            />
          </Switch>
        </div>
        <ToastNotify/>
      </div>
    </BrowserRouter>
  }
}

export default withStyles(styles)(Root)