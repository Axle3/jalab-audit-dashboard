import React, { createContext, useContext, useState } from 'react';
import { AuthState, User } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  createUser: (username: string, password: string) => Promise<void>;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', password: 'Jalab2011', role: 'admin' }
  ]);
  const { toast } = useToast();

  console.log('Current users:', users); // For debugging

  const createUser = async (username: string, password: string) => {
    console.log('Creating user:', username); // For debugging
    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      password,
      role: 'user'
    };
    setUsers([...users, newUser]);
    toast({
      title: "User Created",
      description: `New user "${username}" has been created successfully.`,
    });
  };

  const login = async (username: string, password: string) => {
    console.log('Login attempt:', username); // For debugging
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setAuth({
        user: { id: user.id, username: user.username, role: user.role },
        isAuthenticated: true,
      });
      toast({
        title: `Welcome back, ${user.username}!`,
        description: 'You have successfully logged in.',
      });
    } else {
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
    <AuthContext.Provider value={{ ...auth, login, logout, createUser, users }}>
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