import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    return {
      isAuthenticated: !!token,
      token,
    };
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setAuth({ isAuthenticated: true, token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false, token: null });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth({ isAuthenticated: true, token });
    }
  }, []);

  return {
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    login,
    logout,
  };
} 