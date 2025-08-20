
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, Role } from '../types';
import { api, Credentials } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<User>;
  register: (credentials: Credentials & { role: Role }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    const loggedInUser = await api.login(credentials);
    setUser(loggedInUser);
    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    return loggedInUser;
  }, []);

  const register = useCallback(async (credentials: Credentials & { role: Role }) => {
    const newUser = await api.register(credentials);
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    api.logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
