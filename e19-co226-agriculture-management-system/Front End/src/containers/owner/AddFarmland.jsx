import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button, Box, MenuItem, 
    Select, Paper, InputLabel, FormControl, Grid, Stack, Divider,
    Snackbar, Alert, CircularProgress
} from '@mui/material';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { motion } from 'framer-motion';
import { useNic } from "../../components/NicContext.jsx";

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
// --- CropMaster Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#2f3e46';       
const BORDER_COLOR = '#cad2c5';    
const ACCENT_GREEN = '#52796f';

const formCardStyle = {
    p: 4, 
    borderRadius: '24px', 
    border: `1px solid ${BORDER_COLOR}`, 
    bgcolor: '#fff',
    height: '100%'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
        '&.Mui-focused fieldset': { borderColor: SAGE_DARK },
    }
};

const AddFarmland = () => {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [location, setLocation] = useState('');

    const [farmers, setFarmers] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [nicFarmlands, setNicFarmlands] = useState([]);
    
    const [selectedFarmer, setSelectedFarmer] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [selectedAssignFarmer, setSelectedAssignFarmer] = useState('');
    const [selectedAssignFarmland, setSelectedAssignFarmland] = useState('');
    
    // UI Feedback
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const { nic: ownerNIC } = useNic();

    useEffect(() => {
        if (!ownerNIC) return;
        fetch(`http://localhost:8080/farmer/byOwner/${ownerNIC}`).then(res => res.json()).then(data => setFarmers(data));
        fetch(`http://localhost:8080/farmland/noNicByOwner/${ownerNIC}`).then(res => res.json()).then(data => setFarmlands(data));
        fetch(`http://localhost:8080/farmland/nicByOwner/${ownerNIC}`).then(res => res.json()).then(data => setNicFarmlands(data));
    }, [ownerNIC]);

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const handleAddFarmland = async () => {
        if (!name || !size || !location) return showNotify("Please fill all fields", "warning");
        if (!ownerNIC) return showNotify("Owner session invalid", "error");
        setLoading(true);
        try {
            const newFarmland = { name, size, location, ownerNIC };
            const res = await fetch('http://localhost:8080/farmland/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFarmland),
            });
            if (res.ok) {
                showNotify("Land registered successfully!", "success");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showNotify("Registration failed", "error");
            }
        } catch (e) { showNotify("Connection error", "error"); }
        setLoading(false);
    };

    const handleAssignFarmer = async () => {
        console.log("Assigning:", { selectedFarmland, selectedFarmer });
        if (!selectedFarmer || !selectedFarmland) return showNotify("Please select both farmer and plot", "warning");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/farmland/updateFarmer/${selectedFarmland}/${selectedFarmer}`, { method: 'PUT' });
            if (res.ok) {
                showNotify("Personnel deployed successfully!", "success");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showNotify("Deployment failed", "error");
            }
        } catch (e) { showNotify("Assignment error", "error"); }
        setLoading(false);
    };

    const handleUpdateAssignFarmer = async () => {
        if (!selectedAssignFarmland || !selectedAssignFarmer) return showNotify("Selection incomplete", "warning");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/farmland/updateFarmer/${selectedAssignFarmland}/${selectedAssignFarmer}`, { method: 'PUT' });
            if (res.ok) {
                showNotify("Management transferred successfully!", "success");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showNotify("Transfer failed", "error");
            }
        } catch (e) { showNotify("Transfer error", "error"); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', py: 6, color: SAGE_DARK }}>
            <Container maxWidth="lg">
                
                {/* Header Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: ACCENT_GREEN, letterSpacing: 2 }}>
                        Asset Management
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                        Land & Resource Registry
                    </Typography>
                    <Divider sx={{ width: 60, height: 4, bgcolor: ACCENT_GREEN, mx: 'auto', mt: 2, borderRadius: 1, border: 'none' }} />
                </Box>

                <Grid container spacing={4} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                    
                    {/* 1. Add New Farmland */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Paper elevation={0} sx={formCardStyle}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <LandscapeIcon sx={{ color: ACCENT_GREEN }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Register Land</Typography>
                            </Stack>
                            <Stack spacing={2.5}>
                                <TextField label="Property Name" fullWidth sx={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                                <TextField label="Acreage / Size" fullWidth sx={inputStyle} value={size} onChange={(e) => setSize(e.target.value)} />
                                <TextField label="Geographic Location" fullWidth sx={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} />
                                <Button variant="contained" fullWidth onClick={handleAddFarmland} sx={{ bgcolor: SAGE_DARK, py: 1.5, borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#1e293b' } }}>
                                    Confirm Registration
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* 2. Assign Farmer (Initial) */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Paper elevation={0} sx={formCardStyle}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <PersonAddIcon sx={{ color: ACCENT_GREEN }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Primary Assignment</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                Assign an available farmer to a newly registered, unmanaged plot.
                            </Typography>
                            <Stack spacing={2.5}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Operator</InputLabel>
                                    <Select label="Select Operator" value={selectedFarmer} onChange={(e) => setSelectedFarmer(e.target.value)}>
                                        {farmers.map(f => <MenuItem key={f.nic} value={f.nic}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Plot</InputLabel>
                                    <Select label="Select Plot" value={selectedFarmland} onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlands.map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" fullWidth onClick={handleAssignFarmer} sx={{ borderColor: SAGE_DARK, color: SAGE_DARK, py: 1.5, borderRadius: '12px', fontWeight: 800, border: '2px solid' }}>
                                    Deploy Personnel
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* 3. Change Assignment (Re-assignment) */}
                    <Grid item xs={12} component={motion.div} variants={itemParams}>
                        <Paper elevation={0} sx={{ ...formCardStyle, bgcolor: '#fdfcf0' }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <SyncAltIcon sx={{ color: SAGE_DARK }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Re-assignment Hub</Typography>
                            </Stack>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth sx={inputStyle}>
                                        <InputLabel>New Operator</InputLabel>
                                        <Select label="New Operator" value={selectedAssignFarmer} onChange={(e) => setSelectedAssignFarmer(e.target.value)}>
                                            {(Array.isArray(farmers) ? farmers : []).map(f => <MenuItem key={f.nic} value={f.nic}>{f.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth sx={inputStyle}>
                                        <InputLabel>Current Managed Land</InputLabel>
                                        <Select label="Current Managed Land" value={selectedAssignFarmland} onChange={(e) => setSelectedAssignFarmland(e.target.value)}>
                                            {(Array.isArray(nicFarmlands) ? nicFarmlands : []).map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button variant="contained" fullWidth onClick={handleUpdateAssignFarmer} sx={{ bgcolor: ACCENT_GREEN, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#6d8a6b' } }}>
                                        Transfer Management
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
            </Container>

            <Snackbar 
                open={notification.open} 
                autoHideDuration={4000} 
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddFarmland;