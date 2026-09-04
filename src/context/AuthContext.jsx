import React, { createContext, useContext, useState, useCallback } from 'react';
import { appwriteService } from '../services/appwriteService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // Public pages have no account features, so the session is resolved lazily —
  // only ProtectedRoute and the login page ask for it. Checking on mount cost
  // every anonymous visitor a 401 round-trip.
  const [checked, setChecked] = useState(false);

  const checkUser = useCallback(async () => {
    setLoading(true);
    try {
      setUser(await appwriteService.getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setChecked(true);
      setLoading(false);
    }
  }, []);

  const ensureChecked = useCallback(() => {
    setChecked((done) => {
      if (!done) checkUser();
      return done;
    });
  }, [checkUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const current = await appwriteService.login(email, password);
      setUser(current);
      setChecked(true);
      return current;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await appwriteService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checked,
        isAdmin: Boolean(user?.isAdmin),
        login,
        logout,
        checkUser,
        ensureChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
