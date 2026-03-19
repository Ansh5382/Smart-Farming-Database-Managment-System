// Home.jsx
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import AppHeader from "../components/owner/AppHeader.jsx";
import SideNav from "../components/owner/SideNav.jsx";
import { Navigate, Outlet } from "react-router-dom";
import { useNic } from "../components/NicContext.jsx";

const OwnerLayout = () => {
    const { isAuthenticated, role, isLoading } = useNic();

    if (isLoading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated || role !== 'owner') {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <AppHeader/>
            <Box sx={styles.container}>
                <SideNav/>
                <Box
                    component={'main'}
                    sx={styles.mainSection}
                >
                    <Outlet/>
                </Box>

            </Box>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        bgcolor: 'neutral.light',
        height: 'calc(100% - 64px)'
    },
    mainSection: {
        p: 4,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin:'0px',
        padding:'0px',
    }
}

export default OwnerLayout;
