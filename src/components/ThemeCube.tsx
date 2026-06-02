import React from "react";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function ThemeCube() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="cube-wrapper" onClick={toggleTheme}>
      <div 
        className="btn-cube"
        style={{
          transform: theme === "light" ? "rotateX(-90deg)" : "rotateX(0deg)"
        }}
      >
        <span className="side top">☀️ LIGHT MODE</span>
        <span className="side front">🌙 DARK MODE</span>
      </div>
    </div>
  );
}
