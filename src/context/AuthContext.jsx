import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchMe,
  getStoredToken,
  login as apiLogin,
  loginWithGoogle as apiGoogle,
  register as apiRegister,
  setStoredToken,
  updateMe,
} from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const bootstrap = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await fetchMe();
      setUser(data.data.user);
    } catch {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('mastplayer:logout', onLogout);
    return () => window.removeEventListener('mastplayer:logout', onLogout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await apiLogin({ email, password });
    setStoredToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async ({ name, email, password, referralCode }) => {
    const { data } = await apiRegister({
      name,
      email,
      password,
      ...(referralCode ? { referralCode } : {}),
    });
    setStoredToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const loginWithGoogle = useCallback(async (idToken, referralCode) => {
    const { data } = await apiGoogle(idToken, referralCode);
    setStoredToken(data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await updateMe(payload);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      updateProfile,
      logout,
      refresh: bootstrap,
    }),
    [user, loading, login, register, loginWithGoogle, updateProfile, logout, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
