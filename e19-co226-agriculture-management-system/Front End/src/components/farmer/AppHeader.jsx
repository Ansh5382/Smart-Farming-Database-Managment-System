import React, { useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Avatar, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import { useProSidebar } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { useNic } from '../NicContext';
import { useLanguage } from '../LanguageContext';

function AppHeader() {
    const navigate = useNavigate();
    const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
    const { clearNic } = useNic();
    const { language, changeLanguage } = useLanguage();
    
    const [langAnchor, setLangAnchor] = useState(null);
    
    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ta', name: 'Tamil', flag: '🇱🇰' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'si', name: 'Sinhala', flag: '🇱🇰' }
    ];

    const handleSignOut = () => {
        clearNic();
        navigate('/');
    };
    
    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setLangAnchor(null);
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
                    color="primary"
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/farmerhome')}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <AgricultureIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}>
                        CropMaster
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Button 
                    startIcon={<PersonIcon />} 
                    onClick={() => navigate('/profile')}
                    sx={{ color: 'text.secondary', mr: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Profile
                </Button>

                <Button 
                    startIcon={<AssessmentIcon />} 
                    onClick={() => navigate('/reports')}
                    sx={{ color: 'text.secondary', mr: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Reports
                </Button>

                <Button
                    startIcon={<LanguageIcon />}
                    onClick={(e) => setLangAnchor(e.currentTarget)}
                    sx={{ color: 'text.secondary', mr: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Language
                </Button>
                <Menu
                    anchorEl={langAnchor}
                    open={Boolean(langAnchor)}
                    onClose={() => setLangAnchor(null)}
                >
                    {languages.map((lang) => (
                        <MenuItem 
                            key={lang.code} 
                            onClick={() => handleLanguageChange(lang.code)}
                            selected={language === lang.code}
                        >
                            {lang.flag} {lang.name}
                        </MenuItem>
                    ))}
                </Menu>

                <IconButton title="Settings" onClick={() => navigate('/settings')} sx={{ color: 'text.secondary', mr: 1 }}>
                    <SettingsIcon />
                </IconButton>

                <IconButton title="Sign Out" onClick={handleSignOut} sx={{ color: 'error.main' }}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;
