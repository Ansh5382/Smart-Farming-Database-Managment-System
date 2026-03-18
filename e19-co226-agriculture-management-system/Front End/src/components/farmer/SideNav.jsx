import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { Menu, MenuItem, Sidebar, useProSidebar } from "react-pro-sidebar";
import {Link, useLocation} from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ScienceIcon from '@mui/icons-material/Science';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LandscapeIcon from '@mui/icons-material/Landscape';
import CloudIcon from '@mui/icons-material/Cloud';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import {useNic} from "../NicContext.jsx";
import {useEffect, useState} from "react";
import { useLanguage } from "../LanguageContext";

function SideNav() {
    const { nic } = useNic();
    const { collapsed } = useProSidebar();
    const theme = useTheme();
    const location = useLocation();
    const { t } = useLanguage();

    const isMenuItemActive = (path) => {
        return location.pathname === path;
    };


    const [farmer, setFarmer] = useState(''); // State to hold the farmer's name

    useEffect(() => {
        const fetchFarmerName = async () => {
            if (!nic) return;
            try {
                const response = await fetch(`http://localhost:8080/farmer/${nic}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch farmer name');
                }
                const data = await response.json();
                setFarmer(data || { name: 'Personnel' });
            } catch (error) {
                console.error('Error fetching farmer name:', error);
                setFarmer({ name: 'Personnel' });
            }
        };

        fetchFarmerName();
    }, [nic]);

    return <Sidebar
        style={{ height: "100%", top: 'auto', borderRight: 'none' }}
        breakPoint="md"
        backgroundColor={theme.palette.background.paper}
    >
        <Box sx={styles.avatarContainer}>
            <Avatar sx={styles.avatar} alt="Farmer" src="src/assets/avatars/sidebar_avatar.png" />
            {!collapsed ? <Typography variant="h6" sx={styles.yourChannel}>{t('welcomeFarmer') || 'Welcome Farmer'}</Typography> : null}
            {!collapsed ? <Typography variant="body2" sx={{ color: 'text.secondary' }}> {farmer.name} </Typography> : null}
        </Box>

        <Menu
            menuItemStyles={{
                button: ({ level, active }) => {
                    return {
                        backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : undefined,
                        color: active ? '#52796f' : theme.palette.text.primary,
                        borderRadius: '8px',
                        margin: '4px 12px',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.04)',
                        },
                    };
                },
                icon: ({ active }) => ({
                    color: active ? '#52796f' : theme.palette.text.secondary,
                }),
            }}>
            <MenuItem active={window.location.pathname === "/farmerhome"} component={<Link to="/farmerhome" />} icon={<HomeOutlinedIcon />}> <Typography variant="body2">{t('home') || 'Home'}</Typography> </MenuItem>
            <MenuItem active={window.location.pathname === "/updatesoil"} component={<Link to="/updatesoil" />} icon={<LandscapeIcon />}> <Typography variant="body2">{t('soil') || 'Update Soil'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/updateweather"} component={<Link to="/updateweather" />} icon={<CloudIcon />}> <Typography variant="body2">{t('weather') || 'Update Weather'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/reportdisease"} component={<Link to="/reportdisease" />} icon={<CoronavirusIcon />}> <Typography variant="body2">{t('disease') || 'Report Diseases'}</Typography></MenuItem>
            <MenuItem active={window.location.pathname === "/usechemical"} component={<Link to="/usechemical" />} icon={<ScienceIcon />}> <Typography variant="body2">{t('chemicals') || 'Use Chemicals'}</Typography></MenuItem>
            <MenuItem active={window.location.pathname === "/usemachine"} component={<Link to="/usemachine" />} icon={<PrecisionManufacturingIcon />}> <Typography variant="body2">{t('machinery') || 'Use Machines'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/irrigation"} component={<Link to="/irrigation" />} icon={<WaterDropIcon />}> <Typography variant="body2">{t('irrigation') || 'Irrigation'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/harvest"} component={<Link to="/harvest" />} icon={<AgricultureIcon />}> <Typography variant="body2">{t('harvest') || 'Harvest'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/storage"} component={<Link to="/storage" />} icon={<WarehouseIcon />}> <Typography variant="body2">{t('storage') || 'Storage'}</Typography></MenuItem >
            <MenuItem active={window.location.pathname === "/soilhealth"} component={<Link to="/soilhealth" />} icon={<HealthAndSafetyIcon />}> <Typography variant="body2">{t('soilHealth') || 'Soil Health'}</Typography></MenuItem >

        </Menu >
    </Sidebar >;
}

export default SideNav;

/**
 * @type {import("@mui/material").SxProps}
 */
const styles = {
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: 'column',
        my: 5
    },
    avatar: {
        width: '40%',
        height: 'auto'
    },
    yourChannel: {
        mt: 1
    }

}
