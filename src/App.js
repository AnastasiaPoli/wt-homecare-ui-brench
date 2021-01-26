import React, { Component } from 'react';
import { createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import '@fortawesome/fontawesome-free/css/all.css';

import './App.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import Routes from './Routes';
import Footer from './components/Footer';

// const captchaSiteKey = '6LcrYawUAAAAAEyAjgJo7jfrWBqVYKKU2jbUxwo_';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#008080'
    },
    secondary: {
      main: orange[800]
    },

    error: {
      main: '#ff0000'
    },
    warning: {
      main: '#ffa500'
    },
    info: {
      main: '#7ccfda'
    }
  },
  typography: {
    fontFamily: ['"Lato"', 'sans-serif'].join(',')
  }
});

class App extends Component {
  componentDidMount() {
    // loadReCaptcha(captchaSiteKey);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <React.Fragment>
            <Grid container justify="center">
              <Routes />
            </Grid>
          </React.Fragment>
        </ErrorBoundary>
        <Footer />
      </ThemeProvider>
    );
  }
}

export default App;
