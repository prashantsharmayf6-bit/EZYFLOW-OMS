import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nexus_current_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user session:", error);
      localStorage.removeItem('nexus_current_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersStr = localStorage.getItem('nexus_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
        const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        setUser(userData);
        localStorage.setItem('nexus_current_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Login error (storage parsing):", error);
    }

    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const usersStr = localStorage.getItem('nexus_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.find((u: any) => u.email === email)) {
        setIsLoading(false);
        return false; // User exists
      }

      const newUser = { id: `U-${Date.now()}`, name, email, password };
      users.push(newUser);
      localStorage.setItem('nexus_users', JSON.stringify(users));

      const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(userData);
      localStorage.setItem('nexus_current_user', JSON.stringify(userData));
      
      setIsLoading(false);
      return true;
    } catch (error) {
       console.error("Signup error:", error);
       setIsLoading(false);
       return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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