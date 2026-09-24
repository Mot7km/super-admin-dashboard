import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, roleName?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mot7km_auth') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('mot7km_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, roleName: string = 'Owner / Admin') => {
    const userData: User = {
      name: email.includes('manager') ? 'Branch Manager' : 'Alex Morgan',
      email,
      role: roleName,
    };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('mot7km_auth', 'true');
    localStorage.setItem('mot7km_user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('mot7km_auth');
    localStorage.removeItem('mot7km_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
