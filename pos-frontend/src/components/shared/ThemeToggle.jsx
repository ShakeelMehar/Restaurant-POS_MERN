import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-popover text-foreground transition-colors hover:bg-card border border-border shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FaSun className="h-5 w-5 text-primary-yellow" />
      ) : (
        <FaMoon className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
