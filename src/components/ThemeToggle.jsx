// src/components/ThemeToggle.jsx
import React, { useState, useEffect } from 'react';
import '../styles/theme.css';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('logshield-theme');
        return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('logshield-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('logshield-theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
            {darkMode ? '??' : '??'}
        </button>
    );
};