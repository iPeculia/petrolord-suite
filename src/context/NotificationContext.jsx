import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Model Update', message: 'Facies model generated successfully', type: 'success', read: false, time: '2m ago' },
    { id: 2, title: 'System Alert', message: 'High memory usage detected', type: 'warning', read: false, time: '1h ago' }
  ]);

  const toggleNotifications = () => setIsOpen(!isOpen);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      isOpen,
      toggleNotifications,
      notifications,
      markAsRead,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};