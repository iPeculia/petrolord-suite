import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [isInApplication, setIsInApplication] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();

  // Automatically handle app mode based on routes
  useEffect(() => {
    // Check if current path is an app route (but not a hub)
    const isAppRoute = location.pathname.includes('/apps/') && 
                      !location.pathname.includes('/hub') &&
                      !location.pathname.endsWith('/dashboard');
    
    if (isAppRoute) {
      setIsInApplication(true);
    } else {
      setIsInApplication(false);
    }
  }, [location.pathname]);

  const enterAppMode = () => setIsInApplication(true);
  const exitAppMode = () => setIsInApplication(false);
  
  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  const value = {
    isInApplication,
    setIsInApplication,
    enterAppMode,
    exitAppMode,
    sidebarVisible,
    toggleSidebar
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};