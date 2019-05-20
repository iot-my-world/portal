import {
  containerFluid,
  defaultBoxShadow,
} from 'components/style/style'

const headerStyle = theme => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    position: 'absolute',
    width: '100%',
    zIndex: '1029',
    color: '#555555',
    border: '0',
    transition: 'all 150ms ease 0s',
    height: '50px',
    display: 'flex',
    padding: 0,
  },
  container: {
    ...containerFluid,
    minHeight: '50px',
  },
  toolbarDesktop: {
    height: '50px',
    minHeight: '50px',
    display: 'flex',
  },
  toolbarMini: {
    height: '50px',
    minHeight: '50px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    ...defaultBoxShadow,
  },
  sidebarMinimize: {
    float: 'left',
    color: '#555555',
  },
  sidebarMiniIcon: {
    width: '20px',
    height: '17px',
  },
  logoWrapperMini: {
  },
  logoMini: {
    width: '30px',
    verticalAlign: 'middle',
    border: '0',
  },
  desktopViewName: {
    paddingLeft: '10px'
  },
  miniViewName: {

  },
})

export default headerStyle
