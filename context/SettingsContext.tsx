import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  companyName: string;
  setCompanyName: (name: string) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyName, setCompanyName] = useState('Ezyflow');
  const [logo, setLogo] = useState<string | null>(null);

  // Initialize from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedName) setCompanyName(savedName);
    if (savedLogo) setLogo(savedLogo);
  }, []);

  const updateCompanyName = (name: string) => {
    setCompanyName(name);
    localStorage.setItem('companyName', name);
  };

  const updateLogo = (newLogo: string | null) => {
    setLogo(newLogo);
    if (newLogo) {
      localStorage.setItem('companyLogo', newLogo);
    } else {
      localStorage.removeItem('companyLogo');
    }
  };

  return (
    <SettingsContext.Provider value={{ companyName, setCompanyName: updateCompanyName, logo, setLogo: updateLogo }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};