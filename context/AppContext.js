import React, { createContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../firebaseConfig';


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
 
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState( false);




  console.log(isDarkMode)

  function clearCurrentData(){
    setUser(null);
    setIsDarkMode(false);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
  
  return (
    <AppContext.Provider
     value={{ 
        user, 
        setUser,
        isDarkMode,
        setIsDarkMode,
        clearCurrentData,
     }}
     >
      {children}
    </AppContext.Provider>
  );
};
