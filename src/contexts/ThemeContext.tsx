import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("light");
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  const toggleTheme = () => {
    // Light-theme only platform
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}


