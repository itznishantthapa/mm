import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <AppContext.Provider
     value={{ 
        user, 
        setUser,
        isDarkMode,
        setIsDarkMode,
     }}
     >
      {children}
    </AppContext.Provider>
  );
};
