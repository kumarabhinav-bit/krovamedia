import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../constants';

interface ContentContextType {
  data: SiteData;
  updateData: (newData: SiteData) => void;
  resetData: () => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('krova_site_data');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (e) {
      console.error("Failed to load data from local storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateData = (newData: SiteData) => {
    setData(newData);
    try {
      localStorage.setItem('krova_site_data', JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save data to local storage", e);
      alert("Failed to save changes. Storage might be full.");
    }
  };

  const resetData = () => {
    if(window.confirm("Are you sure? This will factory reset all website content.")) {
      setData(INITIAL_SITE_DATA);
      localStorage.removeItem('krova_site_data');
    }
  }

  return (
    <ContentContext.Provider value={{ data, updateData, resetData, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};