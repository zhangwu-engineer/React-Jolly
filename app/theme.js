import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    common: {
      green: '#6bd258',
    },
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#3c3e43',
      secondary: '#949a9c',
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
        paddingBottom: 15,
      },
    },
  },
});

export default theme;
