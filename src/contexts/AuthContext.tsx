import React, { createContext, useContext, useState } from 'react';
import { AuthState, User } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'Jalab2011') {
      setAuth({
        user: { id: '1', username: 'admin', role: 'admin' },
        isAuthenticated: true,
      });
      toast({
        title: 'Welcome back, Admin!',
        description: 'You have successfully logged in.',
      });
    } else {
      // In a real app, this would be an API call
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
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