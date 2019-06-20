import {createMuiTheme} from '@material-ui/core/styles'

export const themeOptions = {
  default: 'default',
}


export const getTheme = (themeName) => {
  switch (themeName) {
    case themeOptions.default:
    default:
      return createMuiTheme(defaultTheme)
  }
}

const defaultTheme = {
  name: themeOptions.default,
  palette: {
    primary: { main: '#0E2F56' },
    secondary: { main: '#FF304F' },
    error: { main: '#ff111b'},
    background: { main: '#cbcbcb'},
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    useNextVariants: true,
  },
}
