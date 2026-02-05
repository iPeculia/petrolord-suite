import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    density: 'normal'
  });

  const toggleSettings = () => setIsOpen(!isOpen);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{
      isOpen,
      toggleSettings,
      settings,
      updateSetting
    }}>
      {children}
    </SettingsContext.Provider>
  );
};