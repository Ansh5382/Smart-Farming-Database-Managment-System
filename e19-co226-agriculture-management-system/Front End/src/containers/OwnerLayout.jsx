// Home.jsx
import React from 'react';
import { Box } from '@mui/material';
import AppHeader from "../components/owner/AppHeader.jsx";
import SideNav from "../components/owner/SideNav.jsx";
import { Outlet } from "react-router-dom";

const OwnerLayout = () => {

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
