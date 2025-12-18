// context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import toast from 'react-hot-toast';

type User = { name: string; role: string; email?: string };
type AuthContextType = {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success('Login successful!');
    if (userData.role === 'Admin') router.push('/dashboard/admin');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
