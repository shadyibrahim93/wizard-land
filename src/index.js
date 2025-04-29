import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
