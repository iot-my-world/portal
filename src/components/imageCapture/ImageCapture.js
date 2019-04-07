import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Button, withStyles,
} from '@material-ui/core'

// https://bryanbierce.com/react-webcam/

const styles = theme => ({
  wrapper: {
    display: 'grid',
    justifyItems: 'center',
    alignItems: 'center',
    gridTemplateColumns: 'auto',
    gridTemplateRows: 'auto',
  },
  picSize: {
    width: 400,
    height: 300,
  },
})

const states = {
  RequestingCameraAccess: 0,
  CameraAccessGranted: 1,
  CameraAccessDenied: 2,
  Streaming: 3,
  StartImgCapture: 4,
  ImgCaptured: 5,
}

const events = {
  INIT: states.RequestingCameraAccess,
  GrantCameraAccess: states.CameraAccessGranted,
  DenyCameraAccess: states.CameraAccessDenied,
  StartStreaming: states.Streaming,
  ImgCaptureReq: states.StartImgCapture,
  ImageCaptured: states.ImgCaptured,
  TryAgain: states.CameraAccessGranted,
}

class ImageCapture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageData: undefined,
      activeState: events.INIT,
    }
  }

  componentDidMount() {
    this.requestCameraAccess()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      activeState: prevActiveState,
    } = prevState
    const {
      activeState,
    } = this.state

    if (prevActiveState !== activeState) {
      switch (activeState) {
        case states.CameraAccessGranted:
          this.startStreamingCamera()
          break
        case states.CameraAccessDenied:
          console.error('camera access denied')
          break
        case states.StartImgCapture:
          this.takePicture()
          break
        default:
          break
      }
    }
  }

  requestCameraAccess = () => {
    // const {
    //     // TODO: Fix this. Use actual desired resolution instead of cheating
    //     ImageResolution,
    //     StillBoxStyle,
    // } = this.props
    const streamConstraints = {
      audio: false,
      video: {
        // width: StillBoxStyle.width,
        // height: StillBoxStyle.height,
        width: 320,
        height: 240,
      },
    }

    const requestCameraAccess = (params) => (
        new Promise((successCallback, errorCallback) => {
          navigator.webkitGetUserMedia.call(navigator, params, successCallback,
              errorCallback)
        })
    )

    requestCameraAccess(streamConstraints)
        .then((stream) => {
          this.setState({
            activeState: events.GrantCameraAccess,
            cameraStream: stream,
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({activeState: events.DenyCameraAccess})
        })
  }

  startStreamingCamera = () => {
    const {
      cameraStream,
    } = this.state

    const video = document.querySelector('video')
    video.srcObject = cameraStream
    video.play()
    this.setState({activeState: events.StartStreaming})
  }

  takePicture = () => {
    const {
      // TODO: Fix this. Use actual desired resolution instead of cheating
      // ImageResolution,
      // StillBoxStyle,
      StreamBoxStyle,
    } = this.props

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    const video = document.querySelector('video')

    // TODO: Fix this. Use actual desired resolution instead of cheating
    canvas.width = StreamBoxStyle.width
    canvas.height = StreamBoxStyle.height
    // context.drawImage(video, 0, 0, ImageResolution.width, ImageResolution.height)
    context.drawImage(video, 0, 0, StreamBoxStyle.width, StreamBoxStyle.height)
    const imageData = canvas.toDataURL('image/png')

    this.setState({
      activeState: events.ImageCaptured,
      imageData,
    })
  }

  render() {
    const {
      state,
      renderStreaming,
      renderCapturedImage,
    } = this
    const {
      activeState,
    } = state

    return (
        <div style={styles.wrapper}>
          {(() => {
            switch (activeState) {
              case states.RequestingCameraAccess:
                return (<div>Waiting For Camera Access</div>)
              case states.CameraAccessDenied:
                return (<div>Unable to Access Camera</div>)
              case states.CameraAccessGranted:
              case states.Streaming:
              case states.StartImgCapture:
                return (renderStreaming())
              case states.ImgCaptured:
                return (renderCapturedImage())
              default:
                return (<div>You Should Never See This</div>)
            }
          })()}
        </div>
    )
  }

  renderStreaming = () => {
    const {
      StreamBoxStyle,
    } = this.props
    return (
        <div style={{
          display: 'grid',
          alignItems: 'center',
          justifyItems: 'center',
          gridTemplateColumns: 'auto',
          gridTemplateRows: 'auto auto',
        }}>
          <video id='video' style={StreamBoxStyle}/>
          <div>
            <Button
                variant={'contained'}
                onClick={() => this.setState(
                    {activeState: events.ImgCaptureReq})}
            >
              Take Photo
            </Button>
          </div>
        </div>
    )
  }

  renderCapturedImage = () => {
    const {
      StillBoxStyle,
      onSave,
    } = this.props
    const {
      imageData,
    } = this.state

    return (
        <div style={{
          display: 'grid',
          justifyItems: 'center',
          gridTemplateColumns: 'auto',
          gridTemplateRows: 'auto auto',
        }}>
          <img
              alt={'capturedImage'}
              id='photo'
              src={imageData}
              style={StillBoxStyle}
          />
          <div style={{
            display: 'grid',
            justifyItems: 'center',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'auto',
          }}>
            <div style={{paddingRight: '2px'}}>
              <Button
                  variant={'contained'}
                  onClick={() => onSave(imageData)}
              >
                Save Photo
              </Button>
            </div>
            <div style={{paddingLeft: '2px'}}>
              <Button
                  variant={'contained'}
                  onClick={() => this.setState({activeState: events.TryAgain})}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
    )
  }
}

ImageCapture.propTypes = {
  ImageResolution: PropTypes.object,
  StreamBoxStyle: PropTypes.object,
  StillBoxStyle: PropTypes.object,
  onSave: PropTypes.func.isRequired,
}

ImageCapture.defaultProps = {
  ImageResolution: {
    width: 640,
    height: 480,
  },
  StreamBoxStyle: {
    width: 320,
    height: 240,
    padding: '10px',
  },
  StillBoxStyle: {
    width: 320,
    height: 240,
    padding: '10px',
  },
  onSave: () => console.error('No OnSaveFunctionPassed'),
}

ImageCapture = withStyles(styles)(ImageCapture)

export default ImageCapture