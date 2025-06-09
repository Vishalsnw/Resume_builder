import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// These are CSS or utility files, use direct imports if needed
import './file-input-fix';
import './ref-hack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
