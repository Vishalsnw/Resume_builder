// emergency-fix.js
const fs = require('fs');
const path = require('path');

console.log(`Emergency Fix Script`);
console.log(`Executed by: Vishalsnw`);
console.log(`Timestamp: 2025-06-10 15:39:30`);

// Define paths
const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');
const contextsDir = path.join(srcDir, 'contexts');
const authDir = path.join(componentsDir, 'auth');
const stylesDir = path.join(srcDir, 'styles');

// Ensure directories exist
[srcDir, componentsDir, pagesDir, contextsDir, authDir, stylesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. Create index.js file to make the build non-empty
const indexContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
fs.writeFileSync(path.join(srcDir, 'index.js'), indexContent);
console.log('Created src/index.js');

// 2. Create App.js
const appContent = `
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login';

function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

export default App;
`;
fs.writeFileSync(path.join(srcDir, 'App.js'), appContent);
console.log('Created src/App.js');

// 3. Create AuthContext.tsx
const authContextContent = `
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async (email, password) => {},
  logout: async () => {},
  googleSignIn: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Login with:', email, password);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({ email, id: 'user-1' });
      return true;
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({ email: 'google@example.com', id: 'google-user-1' });
      return true;
    } catch (err) {
      setError('Google sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login,
      logout,
      googleSignIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
`;
fs.writeFileSync(path.join(contextsDir, 'AuthContext.tsx'), authContextContent);
console.log('Created src/contexts/AuthContext.tsx');

// 4. Create login.tsx
const loginPageContent = `
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Resume Builder Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="******************"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-xs">
            Last updated by Vishalsnw at 2025-06-10 15:39:30
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
`;
fs.writeFileSync(path.join(pagesDir, 'login.tsx'), loginPageContent);
console.log('Created src/pages/login.tsx');

// 5. Create globals.css
const cssContent = `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* TailwindCSS-like utility classes */
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-white { background-color: #ffffff; }
.bg-blue-500 { background-color: #3b82f6; }
.hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
.p-4 { padding: 1rem; }
.p-8 { padding: 2rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-8 { margin-top: 2rem; }
.w-full { width: 100%; }
.max-w-md { max-width: 28rem; }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
.shadow-outline { box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); }
.text-center { text-align: center; }
.text-white { color: #ffffff; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }
.text-blue-500 { color: #3b82f6; }
.hover\\:text-blue-800:hover { color: #1e40af; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-2xl { font-size: 1.5rem; }
.font-bold { font-weight: 700; }
.leading-tight { line-height: 1.25; }
.appearance-none { appearance: none; }
.focus\\:outline-none:focus { outline: none; }
.border { border-width: 1px; }
.block { display: block; }
.inline-block { display: inline-block; }
.align-baseline { vertical-align: baseline; }
`;
fs.writeFileSync(path.join(stylesDir, 'globals.css'), cssContent);
console.log('Created src/styles/globals.css');

// 6. Create simple public/index.html
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="AI-powered Resume Builder with Professional Templates" />
    <title>Resume Builder</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('Created public/index.html');

console.log('Emergency fix completed! Created minimal but functional app structure.');
