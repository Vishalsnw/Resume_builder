// client/src/next-mock.js

// Mock next/link
module.exports = {
  default: function Link(props) {
    return props.children || null;
  }
};
