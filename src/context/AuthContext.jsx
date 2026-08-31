import React, { createContext, useContext, useState, useEffect } from 'react';
import { appwriteService } from '../services/appwriteService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    try {
      const current = await appwriteService.getCurrentUser();
      setUser(current);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const sessionUser = await appwriteService.login(email, password);
      const currentUser = await appwriteService.getCurrentUser();
      setUser(currentUser || sessionUser);
      return currentUser || sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const sessionUser = await appwriteService.signup(email, password, name);
      const currentUser = await appwriteService.getCurrentUser();
      setUser(currentUser || sessionUser);
      return currentUser || sessionUser;
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
        isAdmin: Boolean(user?.isAdmin),
        login,
        signup,
        logout,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
