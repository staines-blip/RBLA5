import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider 
      maxSnack={3} 
      autoHideDuration={3000}
      anchorOrigin={{ 
        vertical: 'bottom', 
        horizontal: 'right' 
      }}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
