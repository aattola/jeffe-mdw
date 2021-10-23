import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

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

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <App />
      </HashRouter>
    </QueryClientProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
