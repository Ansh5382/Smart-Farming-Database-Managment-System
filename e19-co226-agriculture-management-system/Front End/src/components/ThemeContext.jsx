import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createAppTheme } from '../config/theme';

const ThemeContext = createContext();

export function useThemeMode() {
    return useContext(ThemeContext);
}

export function ThemeContextProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        return stored === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const theme = useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

    const value = useMemo(() => ({ darkMode, toggleDarkMode, theme }), [darkMode, theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
