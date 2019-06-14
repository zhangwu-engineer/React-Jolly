import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    common: {
      green: '#6bd258',
      gray: '#8c9099',
      white: '#ffffff',
      darkBlue: '#053c77',
      lightBlue: '#f3f9ff',
    },
    primary: {
      main: '#1976d1',
    },
    text: {
      primary: '#313131',
      secondary: '#949a9c',
    },
    background: {
      default: '#f5f6f6',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Avenir Next", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  overrides: {
    MuiInputLabel: {
      root: {
        fontSize: 20,
        color: '#6b6f78',
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: '2px solid #dfe4e6',
        },
      },
    },
    MuiFilledInput: {
      root: {
        borderRadius: '0px !important',
      },
      underline: {
        '&:before': {
          borderBottom: 'none',
        },
      },
    },
    MuiInputBase: {
      input: {
        fontSize: 14,
        fontWeight: 600,
        paddingBottom: 10,
      },
    },
    MuiDivider: {
      root: {
        height: '2px',
        backgroundColor: '#ebebeb',
      },
    },
  },
});

export default theme;
