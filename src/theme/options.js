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
    primary: { main: '#32485c' },
    secondary: { main: '#cbbe34' },
    error: { main: '#ff111b'},
  },
  typography: {
    fontFamily: 'Roboto',
    useNextVariants: true,
  },
}
