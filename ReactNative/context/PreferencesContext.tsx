import React, { createContext, useContext, useState } from "react";

type PreferencesContextType = {
    isMusicOn: boolean;
    toggleMusic: () => void;
    isVibrationOn: boolean;
    toggleVibration: () => void;
  };

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMusicOn, setIsMusicOn] = useState(true);
    const [isVibrationOn, setIsVibrationOn] = useState(true);
  
    const toggleMusic = () => setIsMusicOn((prev) => !prev);
    const toggleVibration = () => setIsVibrationOn((prev) => !prev);
  
    return (
      <PreferencesContext.Provider value={{ isMusicOn, toggleMusic, isVibrationOn, toggleVibration }}>
        {children}
      </PreferencesContext.Provider>
    );
  };


  //custom hook
  export const usePreferences = (): PreferencesContextType => {
    const context = useContext(PreferencesContext);
    if (!context) {
      throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
  };