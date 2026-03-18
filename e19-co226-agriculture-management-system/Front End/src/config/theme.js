import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  primary: {
                      main: '#52796f',
                      light: '#84a98c',
                      dark: '#354f52',
                      contrastText: '#ffffff',
                  },
                  secondary: {
                      main: '#cad2c5',
                      light: '#fdfcf0',
                      dark: '#84a98c',
                      contrastText: '#2f3e46',
                  },
                  neutral: {
                      light: '#fffdf2',
                      medium: '#cad2c5',
                      normal: '#52796f',
                      dark: '#2f3e46',
                      main: '#354f52',
                  },
                  background: {
                      default: '#fdfcf0',
                      paper: '#fffdf2',
                  },
                  text: {
                      primary: '#2f3e46',
                      secondary: '#52796f',
                  },
              }
            : {
                  primary: {
                      main: '#84a98c',
                      light: '#a8c5ae',
                      dark: '#52796f',
                      contrastText: '#ffffff',
                  },
                  secondary: {
                      main: '#52796f',
                      light: '#84a98c',
                      dark: '#354f52',
                      contrastText: '#ffffff',
                  },
                  neutral: {
                      light: '#2f3e46',
                      medium: '#354f52',
                      normal: '#84a98c',
                      dark: '#fdfcf0',
                      main: '#cad2c5',
                  },
                  background: {
                      default: '#1a1a2e',
                      paper: '#16213e',
                  },
                  text: {
                      primary: '#e8e8e8',
                      secondary: '#a8c5ae',
                  },
              }),
        success: { main: mode === 'light' ? '#52796f' : '#84a98c' },
        warning: { main: '#f59e0b' },
        error: { main: '#ef4444' },
        info: { main: mode === 'light' ? '#84a98c' : '#52796f' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '1rem' },
        button: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
        },
        link: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: mode === 'light' ? '#52796f' : '#84a98c',
            display: 'block',
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': { color: mode === 'light' ? '#354f52' : '#a8c5ae' },
        },
        cardTitle: {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '1.25rem',
            display: 'block',
            fontWeight: 600,
            color: mode === 'light' ? '#2f3e46' : '#e8e8e8',
        },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 500 },
        body1: { fontSize: '0.9375rem' },
        body2: { fontSize: '0.875rem' },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '8px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                },
                containedPrimary: {
                    background: mode === 'light'
                        ? 'linear-gradient(135deg, #52796f 0%, #354f52 100%)'
                        : 'linear-gradient(135deg, #84a98c 0%, #52796f 100%)',
                    '&:hover': {
                        background: mode === 'light'
                            ? 'linear-gradient(135deg, #354f52 0%, #2f3e46 100%)'
                            : 'linear-gradient(135deg, #52796f 0%, #354f52 100%)',
                    },
                },
                containedSecondary: {
                    background: mode === 'light'
                        ? 'linear-gradient(135deg, #cad2c5 0%, #84a98c 100%)'
                        : 'linear-gradient(135deg, #52796f 0%, #354f52 100%)',
                    '&:hover': {
                        background: mode === 'light'
                            ? 'linear-gradient(135deg, #84a98c 0%, #52796f 100%)'
                            : 'linear-gradient(135deg, #84a98c 0%, #52796f 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none' },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                },
                elevation2: {
                    boxShadow: mode === 'light'
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                },
                elevation3: {
                    boxShadow: mode === 'light'
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: mode === 'light'
                        ? '0 4px 20px -2px rgba(82, 121, 111, 0.08)'
                        : '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    border: mode === 'light' ? '1px solid rgba(169, 148, 113, 0.2)' : '1px solid rgba(132, 169, 140, 0.2)',
                    background: mode === 'light' ? 'rgba(255, 253, 242, 0.95)' : 'rgba(22, 33, 62, 0.95)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: mode === 'light'
                            ? '0 12px 28px -4px rgba(82, 121, 111, 0.15)'
                            : '0 12px 28px -4px rgba(132, 169, 140, 0.2)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: mode === 'light' ? '#fffdf2' : '#1a1a2e',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: mode === 'light' ? '#cad2c5' : '#354f52',
                            borderWidth: '1.5px',
                        },
                        '&:hover fieldset': {
                            borderColor: mode === 'light' ? '#84a98c' : '#52796f',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: mode === 'light' ? '#52796f' : '#84a98c',
                            borderWidth: '2px',
                        },
                        '&.Mui-focused': {
                            backgroundColor: mode === 'light' ? '#ffffff' : '#16213e',
                            boxShadow: mode === 'light'
                                ? '0 0 0 4px rgba(82, 121, 111, 0.1)'
                                : '0 0 0 4px rgba(132, 169, 140, 0.1)',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? 'rgba(255, 253, 242, 0.85)' : 'rgba(22, 33, 62, 0.85)',
                    backdropFilter: 'blur(12px)',
                    color: mode === 'light' ? '#2f3e46' : '#e8e8e8',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    borderBottom: mode === 'light' ? '1px solid rgba(169, 148, 113, 0.2)' : '1px solid rgba(132, 169, 140, 0.2)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: mode === 'light' ? '#fffdf2' : '#16213e',
                    borderRight: mode === 'light' ? '1px solid rgba(169, 148, 113, 0.2)' : '1px solid rgba(132, 169, 140, 0.2)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    margin: '4px 8px',
                    '&.Mui-selected': {
                        backgroundColor: mode === 'light' ? 'rgba(82, 121, 111, 0.1)' : 'rgba(132, 169, 140, 0.15)',
                        color: mode === 'light' ? '#354f52' : '#a8c5ae',
                        '&:hover': {
                            backgroundColor: mode === 'light' ? 'rgba(82, 121, 111, 0.15)' : 'rgba(132, 169, 140, 0.2)',
                        },
                        '& .MuiListItemIcon-root': {
                            color: mode === 'light' ? '#354f52' : '#a8c5ae',
                        },
                    },
                },
            },
        },
    },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));

export default createAppTheme('light');
