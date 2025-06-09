// ref-hack.js
// Remove the invalid import with square brackets
// import [...nextauth] from '@/pages/api/auth/[...nextauth]';

(function patchRefBehavior() {
  // Wait for React to be available in the global scope or module scope
  function checkAndPatchReact() {
    let React = null;
    
    // Try to find React
    try {
      React = window.React || require('react');
    } catch (e) {
      // React not available yet, retry later
      setTimeout(checkAndPatchReact, 50);
      return;
    }
    
    if (React && React.createRef) {
      // Save original implementation
      const originalCreateRef = React.createRef;
      
      // Override with mutable version
      React.createRef = function() {
        const ref = originalCreateRef();
        // Replace the property descriptor to make current writable
        Object.defineProperty(ref, 'current', {
          configurable: true,
          writable: true,
          value: null
        });
        return ref;
      };
      
      console.log("React ref behavior patched for compatibility");
    }
  }
  
  // Start checking for React
  checkAndPatchReact();
})();

// Export a utility function to safely assign to refs
export function safelyAssignRef(ref, value) {
  if (!ref) return;
  
  try {
    // Try direct assignment first
    ref.current = value;
  } catch (e) {
    // If that fails, use defineProperty
    Object.defineProperty(ref, 'current', {
      configurable: true,
      writable: true,
      value
    });
  }
}
