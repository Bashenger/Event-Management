import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campus_sphere_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('campus_sphere_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate token with backend on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('campus_sphere_token');
      if (token) {
        try {
          const res = await authApi.getMe(token);
          const user = res.user || (res._id ? res : null);
          if (user) {
            setCurrentUser(user);
            localStorage.setItem('campus_sphere_user', JSON.stringify(user));
          }
        } catch (err) {
          // Token expired or invalid
          console.warn('[Auth session expired]');
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Real login against MongoDB backend
  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const user = res.user || (res._id ? res : null);
    const token = res.token;

    if (!user || !token) {
      throw new Error(res.message || 'Authentication failed: Invalid credentials');
    }

    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('campus_sphere_token', token);
    localStorage.setItem('campus_sphere_user', JSON.stringify(user));
    return user;
  };

  // Real registration against MongoDB backend
  const register = async (userData) => {
    const res = await authApi.register(userData);
    const user = res.user || (res._id ? res : null);
    const token = res.token;

    if (!user || !token) {
      throw new Error(res.message || 'Registration failed: Could not create user account');
    }

    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('campus_sphere_token', token);
    localStorage.setItem('campus_sphere_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    localStorage.removeItem('campus_sphere_token');
    localStorage.removeItem('campus_sphere_user');
    setCurrentUser(null);
    setAuthToken(null);
  };

  const isAuthenticated = Boolean(currentUser && authToken);
  const currentRole = currentUser?.role || 'guest';
  const isStudent = currentRole === 'student';
  const isOrganizer = currentRole === 'organizer';
  const isAdmin = currentRole === 'admin';
  const isElevated = isOrganizer || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        currentRole,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        isStudent,
        isOrganizer,
        isAdmin,
        isElevated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
