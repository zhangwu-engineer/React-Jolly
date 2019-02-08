import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    common: {
      green: '#6bd258',
      gray: '#8c9099',
      white: '#ffffff',
    },
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#3c3e43',
      secondary: '#949a9c',
    },
    background: {
      default: '#f5f6f6',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: '"Avenir Next", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
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
