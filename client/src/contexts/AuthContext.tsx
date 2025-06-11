// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

// Create context with default values
const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  login: async (email, password) => {},
  logout: async () => {},
  googleSignIn: async () => {}, // Add this for Google sign-in
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log(`Logging in with email: ${email}`);
      // Mock successful login after delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({ email, id: "user-1" });
      return true;
    } catch (err) {
      setError("Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      // Mock Google sign in
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({ email: "google@example.com", id: "google-user-1" });
      return true;
    } catch (err) {
      setError("Google sign in failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
