import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import emailjs from '@emailjs/browser';
import { HeadProvider } from 'react-head';

// 1️⃣ Handle GH-Pages SPA fallback:
//    If we landed here via 404.html’s redirect, the “real” path
//    was mangled into window.location.search. Pull it out and
//    replace the browser URL so BrowserRouter can handle it.
const fallbackPath = window.location.search.slice(1);
if (fallbackPath) {
  window.history.replaceState(null, '', fallbackPath);
}

// Initialize EmailJS with your public key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HeadProvider>
      <App />
    </HeadProvider>
  </React.StrictMode>
);
