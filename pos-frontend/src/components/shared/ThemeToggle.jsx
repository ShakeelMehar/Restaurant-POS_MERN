import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center h-9 w-16 rounded-full border border-border bg-secondary transition-all duration-300 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
    >
      {/* Sliding indicator */}
      <span
        className={`absolute flex items-center justify-center h-7 w-7 rounded-full shadow-md transition-all duration-300 ${
          isDark
            ? 'translate-x-[2px] bg-secondary border border-border'
            : 'translate-x-[34px] bg-gradient-to-br from-amber-400 to-amber-500 border-0'
        }`}
      >
        {isDark ? (
          <FiMoon className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <FiSun className="h-3.5 w-3.5 text-white" />
        )}
      </span>
      {/* Background icons */}
      <FiSun className={`absolute left-2 h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-40 text-muted-foreground' : 'opacity-0'}`} />
      <FiMoon className={`absolute right-2 h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-40 text-muted-foreground'}`} />
    </button>
  );
};

export default ThemeToggle;
