import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { NotificationContext } from './site-header';

export default function AppWrapper({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(() => ({
    unreadCount, 
    setUnreadCount,
    hasNewMessage, 
    setHasNewMessage
  }), [unreadCount, hasNewMessage]);

  return (
    <NotificationContext.Provider value={contextValue}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
}