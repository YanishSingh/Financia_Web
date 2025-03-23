import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '821722343026-br7imdc7rqvt6rmle4meh4bbkrn4e20n.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
