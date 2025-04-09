import React, { createContext, useContext } from 'react';

// Simplified context that only supports light mode
interface ThemeContextType {
  isDark: boolean; // Always false now
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remove dark mode from root element if it exists
  if (typeof window !== 'undefined') {
    window.document.documentElement.classList.remove('dark');
  }

  // Simplified value that always indicates light mode
  const value = {
    isDark: false
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 