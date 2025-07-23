import { useState, useEffect } from 'react';
import { User, CitizenUser } from '../types';
import { mockUser, mockCitizenUsers } from '../data/mockData';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedCitizenUser = localStorage.getItem('citizenUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedCitizenUser) {
        setCitizenUser(JSON.parse(storedCitizenUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email: string, password: string) => {
    // Simulate login
    if (email && password) {
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const citizenLogin = (aadhaarId: string) => {
    // Find citizen by Aadhaar ID
    const citizen = mockCitizenUsers.find(c => c.aadhaarId === aadhaarId);
    if (citizen) {
      localStorage.setItem('citizenUser', JSON.stringify(citizen));
      setCitizenUser(citizen);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('citizenUser');
    setUser(null);
    setCitizenUser(null);
  };

  return { user, citizenUser, login, citizenLogin, logout, isLoading };
};