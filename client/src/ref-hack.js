// src/ref-hack.js

// Remove invalid imports
// import ref-hack from '@/ref-hack';  // INVALID: hyphen not allowed in variable name
// import [...nextauth] from '@/pages/api/auth/[...nextauth]';  // INVALID: [...] syntax not allowed in variable

// Keep the valid import
import React from 'react';

// Monkeypatch React.RefObject to make current writable
// This is a hack and should be used with caution!
if (typeof window !== 'undefined') {
  const originalCreateRef = React.createRef;
  
  React.createRef = function() {
    const ref = originalCreateRef();
    
    // Make the current property writable
    Object.defineProperty(ref, 'current', {
      get: function() { return this._current; },
      set: function(value) { this._current = value; },
      enumerable: true,
      configurable: true
    });
    
    return ref;
  };

  // Fix useRef too
  const originalUseRef = React.useRef;
  
  React.useRef = function(initialValue) {
    const ref = originalUseRef(initialValue);
    
    // Make the current property writable
    if (!ref.hasOwnProperty('_current')) {
      Object.defineProperty(ref, '_current', {
        value: initialValue,
        writable: true,
        enumerable: false
      });
      
      Object.defineProperty(ref, 'current', {
        get: function() { return this._current; },
        set: function(value) { this._current = value; },
        enumerable: true,
        configurable: true
      });
    }
    
    return ref;
  };
}

// Add a global variable to the window that can be used to bypass the readonly restriction
// Usage: window.__assignRef(myRef, someElement);
if (typeof window !== 'undefined') {
  window.__assignRef = (ref, value) => {
    if (ref) {
      Object.defineProperty(ref, 'current', {
        value,
        writable: true,
        configurable: true
      });
    }
  };
}
