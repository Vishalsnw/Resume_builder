import index from '@/pages/help/index';
import file-input-fix from '@/file-input-fix';
import ref-hack from '@/ref-hack';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import './file-input-fix';
import './ref-hack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
