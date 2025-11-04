import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // messaging
  const messages = useContext ? useMessages() : null;

  // 🔹 Always attach or remove Authorization header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // If we have a token but the stored user is missing important flags (like is_staff), try to fetch fresh user from the API.
  useEffect(() => {
    let mounted = true;
    const needsReload = token && (!user || typeof user.is_staff === 'undefined');
    if (!needsReload) return;

    const loadUser = async () => {
      try {
        // try common endpoints for current user
        const endpoints = ['auth/me/', 'auth/user/', 'auth/profile/'];
        for (const ep of endpoints) {
          try {
            const res = await api.get(ep);
            if (!mounted) return;
            const fetched = res.data;
            if (fetched && typeof fetched === 'object') {
              setUser(fetched);
              localStorage.setItem('user', JSON.stringify(fetched));
              return;
            }
          } catch (e) {
            // ignore and try next
          }
        }
      } catch (err) {
        console.error('Failed to refresh user profile', err);
      }
    };

    loadUser();
    return () => { mounted = false; };
  }, [token]);

  // 🔹 Login endpoint
  const login = async (username, password) => {
    try {
      const res = await api.post('auth/login/', { username, password });

      // Support several common response shapes from different backends
      const data = res.data || {};
      const access = data.access || data.token || data.access_token || data.auth_token || null;
      // user may be nested or returned directly
      const userData = data.user || data.userData || data.user_info || data.profile || (typeof data === 'object' ? data : null);

      if (access) {
        setToken(access);
        localStorage.setItem('accessToken', access);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      }

      if (userData && typeof userData === 'object') {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // show success message when available
      try { messages?.addMessage && messages.addMessage('Login successful', 'success', 3500); } catch (e) {}

      // Return the parsed result so callers can react (e.g., navigate)
      return { access, user: userData };
    } catch (err) {
      console.error('Login failed:', err);
      try { messages?.addMessage && messages.addMessage('Login failed', 'error', 5000); } catch (e) {}
      throw err;
    }
  };

  // 🔹 Register endpoint
  const register = async (formData) => {
    try {
      const res = await api.post('auth/register/', formData);
      try { messages?.addMessage && messages.addMessage('Registration successful', 'success', 4500); } catch (e) {}
      // You could auto-login after registration if you want:
      // await login(formData.username, formData.password);
      return res.data;
    } catch (err) {
      console.error('Registration failed:', err);
      try { messages?.addMessage && messages.addMessage('Registration failed', 'error', 5000); } catch (e) {}
      throw err;
    }
  };

  // 🔹 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    try { messages?.addMessage && messages.addMessage('Logged out', 'success', 2500); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
