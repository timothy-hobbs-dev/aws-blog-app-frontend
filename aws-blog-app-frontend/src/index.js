import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "react-oidc-context";

const origin = window.location.origin;

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_MbWHlzhyX",
  client_id: "358ckpo7hs4694e5q6jslgg965",
  redirect_uri: `${origin}/`,
  response_type: "code",
  scope: "email openid phone profile",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
