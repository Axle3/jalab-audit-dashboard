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
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username already exists.",
      });
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      password,
      role: 'user'
    };
    
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers, newUser];
      // Store in localStorage for persistence
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    toast({
      title: "User Created",
      description: `New user "${username}" has been created successfully.`,
    });
  };

  const login = async (username: string, password: string) => {
    console.log('Login attempt:', username); // For debugging
    
    // First check if it's the admin
    if (username === 'admin' && password === 'Jalab2011') {
      setAuth({
        user: { id: '1', username: 'admin', role: 'admin' },
        isAuthenticated: true,
      });
      toast({
        title: "Welcome Admin",
        description: "You have successfully logged in.",
      });
      return;
    }

    // Then check for regular users
    const user = users.find(u => u.username === username && u.password === password);
    console.log('Found user:', user); // For debugging
    
    if (user) {
      setAuth({
        user: { id: user.id, username: user.username, role: user.role },
        isAuthenticated: true,
      });
      toast({
        title: `Welcome ${user.username}!`,
        description: 'You have successfully logged in.',
      });
    } else {
      console.log('Login failed: Invalid credentials'); // For debugging
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