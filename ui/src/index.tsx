import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import { fetchNui } from './utils/fetchNui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

fetchNui('ip', {}, false).then((data) => {
  if (data.ip) {
    // eslint-disable-next-line no-global-assign
    (window as any).ip = data.ip;
  } else {
    // eslint-disable-next-line no-global-assign
    (window as any).ip = 'localhost';
  }
});

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <App />
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
