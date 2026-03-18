import React, { useState, useEffect } from 'react'
import './App.css'
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import { NicProvider } from "./components/NicContext.jsx";
import { ThemeContextProvider, useThemeMode } from "./components/ThemeContext.jsx";
import { LanguageProvider } from "./components/LanguageContext.jsx";

function AppContent() {
    const { theme } = useThemeMode();
    
    return (
        <ThemeProvider theme={theme}>
            <ProSidebarProvider>
                <CssBaseline />
                <BrowserRouter>
                    <LanguageProvider>
                        <NicProvider>
                            <AppRoutes />
                        </NicProvider>
                    </LanguageProvider>
                </BrowserRouter>
            </ProSidebarProvider>
        </ThemeProvider>
    );
}

function App() {
    return (
        <React.Fragment>
            <ThemeContextProvider>
                <AppContent />
            </ThemeContextProvider>
        </React.Fragment>
    )
}

export default App
