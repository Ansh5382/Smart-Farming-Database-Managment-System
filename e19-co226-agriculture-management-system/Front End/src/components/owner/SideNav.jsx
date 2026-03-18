import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import {Link, useLocation} from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GrassIcon from '@mui/icons-material/Grass';
import {useNic} from "../NicContext.jsx";
import {useEffect, useState} from "react";
import { useLanguage } from "../LanguageContext";

function SideNav() {
    const { collapsed } = useProSidebar();
    const theme = useTheme();
    const { nic } = useNic();
    const location = useLocation();
    const { t } = useLanguage();

    const [owner, setOwner] = useState(''); 

    useEffect(() => {
        if (!nic) return;
        const fetchOwnerName = async () => {
            try {
                const response = await fetch(`http://localhost:8080/owner/${nic}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch owner name');
                }
                const data = await response.json();
                setOwner(data);
            } catch (error) {
                console.error('Error fetching owner name:', error);
            }
        };

        fetchOwnerName();
    }, [nic]);

    return <Sidebar
        style={{ height: "100%", top: 'auto', borderRight: 'none' }}
        breakPoint="md"
        backgroundColor={theme.palette.background.paper}
    >
        <Box sx={styles.avatarContainer}>
            <Avatar 
                sx={styles.avatar} 
                alt="Owner" 
                src="src/assets/avatars/sidebar_avatar.png" 
            />
            {!collapsed && (
                <Box sx={{ textAlign: 'center', mt: 2, px: 2 }}>
                    <Typography variant="h6" sx={styles.welcomeText}>{t('welcomeOwner') || 'Welcome Owner'}</Typography>
                    <Typography variant="body2" sx={styles.ownerName}>{owner.name || 'Admin User'}</Typography>
                </Box>
            )}
        </Box>

        <Menu
            menuItemStyles={{
                button: ({ level, active }) => {
                    return {
                        backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : undefined,
                        color: active ? '#52796f' : theme.palette.text.primary,
                        borderRadius: '12px',
                        margin: '4px 16px',
                        paddingLeft: '24px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.04)',
                            transform: 'translateX(4px)',
                        },
                    };
                },
                icon: ({ active }) => ({
                    color: active ? '#52796f' : theme.palette.text.secondary,
                    fontSize: '20px',
                    marginRight: '20px',
                }),
                label: {
                    fontWeight: 600,
                    fontSize: '14px',
                }
            }}>
            <MenuItem 
                active={location.pathname === "/ownerhome"} 
                component={<Link to="/ownerhome" />} 
                icon={<HomeOutlinedIcon />}
            > 
                {t('home') || 'Home'} 
            </MenuItem>
            <MenuItem 
                active={location.pathname === "/addfarmer"} 
                component={<Link to="/addfarmer" />} 
                icon={<AccountCircleIcon />}
            > 
                {t('farmers') || 'Farmer Details'} 
            </MenuItem>
            <MenuItem 
                active={location.pathname === "/addfarmland"} 
                component={<Link to="/addfarmland" />} 
                icon={<GrassIcon />}
            > 
                {t('farmland') || 'Farm Land'} 
            </MenuItem>
        </Menu >
    </Sidebar >; 
}

export default SideNav;

/** @type {import("@mui/material").SxProps} */
const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: 'column',
        py: 6,
        pl: '56px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        mb: 2
    },
    avatar: {
        width: 80,
        height: 80,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        border: '3px solid #fff',
        ml: 1,
        mb: 2
    },
    welcomeText: {
        fontWeight: 800,
        fontSize: '1rem',
        color: 'text.primary',
        letterSpacing: '-0.5px'
    },
    ownerName: {
        color: 'text.secondary',
        fontSize: '0.85rem',
        fontWeight: 500,
        opacity: 0.8
    }
}
