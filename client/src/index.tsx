import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'; // Adjust the path if App.tsx is in a different location
import './index.css'; // Optional, include if you have a global CSS file

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure this matches the `id` in your public/index.html
);
