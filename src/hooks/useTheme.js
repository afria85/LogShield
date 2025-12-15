// src/hooks/useTheme.js
// Theme management hook with localStorage persistence and system preference support

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'logshield_theme';

/**
 * Custom hook for theme management
 * Supports: 'light', 'dark', 'system'
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    // Get initial theme from storage or default to system
    if (typeof window === 'undefined') return 'light';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
      }
    } catch {
      // localStorage not available
    }
    
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return getResolvedTheme('system');
  });

  // Get resolved theme (actual light/dark) from preference
  function getResolvedTheme(themePreference) {
    if (themePreference === 'light' || themePreference === 'dark') {
      return themePreference;
    }
    
    // System preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  }

  // Apply theme to document
  const applyTheme = useCallback((themeValue) => {
    if (typeof document === 'undefined') return;
    
    const resolved = getResolvedTheme(themeValue);
    setResolvedTheme(resolved);
    
    const root = document.documentElement;
    
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  // Set theme and persist
  const setTheme = useCallback((newTheme) => {
    if (!['light', 'dark', 'system'].includes(newTheme)) {
      console.warn(`Invalid theme: ${newTheme}`);
      return;
    }
    
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // localStorage not available
    }
    
    applyTheme(newTheme);
  }, [applyTheme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const current = getResolvedTheme(theme);
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  // Apply theme on mount and listen for system changes
  useEffect(() => {
    applyTheme(theme);
    
    // Listen for system preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (theme === 'system') {
          applyTheme('system');
        }
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      
      // Legacy browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, applyTheme]);

  return {
    theme,           // User preference: 'light', 'dark', 'system'
    resolvedTheme,   // Actual theme: 'light', 'dark'
    setTheme,        // Set theme function
    toggleTheme,     // Toggle between light/dark
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system'
  };
}

/**
 * Theme provider component
 * Wraps app and initializes theme on mount
 */
export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply theme on mount to prevent flash
    const stored = localStorage.getItem(STORAGE_KEY);
    const theme = stored || 'system';
    let resolved = theme;
    
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    setMounted(true);
  }, []);

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return children;
}

/**
 * Inline script to prevent flash of wrong theme (for SSR)
 */
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('${STORAGE_KEY}');
        var theme = stored || 'system';
        var resolved = theme;
        
        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        if (resolved === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      } catch (e) {}
    })();
  `;
  
  return { __html: script };
}

export default useTheme;
