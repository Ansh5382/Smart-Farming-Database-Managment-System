import React, { useState, useEffect } from 'react';
import {
    Typography, Select, MenuItem, Button, Container, Box,
    Paper, TextField, InputLabel, FormControl, Stack, Alert, 
    Snackbar, CircularProgress, IconButton, Divider, Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNic } from "../../components/NicContext.jsx";
import { 
    ChevronLeft, 
    SettingsSuggest, 
    AppRegistration 
} from '@mui/icons-material';

// --- Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#0f172a';       
const SAGE_LIGHT = '#fdfcf0';      
const BORDER_COLOR = '#cad2c5';    
const ACCENT_GREEN = '#27AE60';

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        bgcolor: '#fff',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
    }
};

const AddHarvestMethod = () => {
    // Safety check for Context
    const context = useNic();
    const nic = context ? context.nic : null;

    const [harvestData, setHarvestData] = useState({ method: '', time: '', cost: '' });
    const [harvestMethods, setHarvestMethods] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [selectedHarvestMethod, setSelectedHarvestMethod] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setHarvestData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchData = async () => {
        if (!nic) return;
        try {
            // First get farmer's owner context
            const resProfile = await fetch(`http://localhost:8080/farmer/${nic}`);
            if (!resProfile.ok) throw new Error("Could not fetch profile");
            const profile = await resProfile.json();
            const ownerNIC = profile.ownerNIC;

            const [resMethods, resLands] = await Promise.all([
                fetch(`http://localhost:8080/harvest/byFarmer/${nic}`),
                fetch(`http://localhost:8080/farmland/getAll/${nic}/${ownerNIC}`)
            ]);
            if (resMethods.ok) setHarvestMethods(await resMethods.json());
            if (resLands.ok) setFarmlands(await resLands.json());
        } catch (error) { 
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, [nic]);

    const handleSubmit = async () => {
        if (!harvestData.method || !harvestData.time || !harvestData.cost) return showNotify("All fields required", "warning");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/harvest/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...harvestData, farmerNIC: nic }),
            });
            if (res.ok) {
                showNotify('Protocol Saved', 'success');
                setHarvestData({ method: '', time: '', cost: '' });
                fetchData();
            }
        } catch (e) { showNotify('Error saving data', 'error'); }
        setLoading(false);
    };

    const handleAssignHarvest = async () => {
        if (!selectedFarmland || !selectedHarvestMethod) return showNotify("Select land and method", "warning");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/farmland/updateHarvest/${selectedFarmland}/${selectedHarvestMethod}`, { method: 'PUT' });
            if (res.ok) {
                showNotify('Assignment Successful', 'success');
                setSelectedFarmland('');
                setSelectedHarvestMethod('');
            }
        } catch (e) { showNotify('Assignment failed', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK, overflowX: 'hidden' }}>
            
            {/* Top Nav */}
            <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Harvest Control
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    NIC: {nic || 'Not Logged In'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid container spacing={4}>
                    
                    {/* Left Column */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Protocols</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Create new harvest methods.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Stack spacing={3}>
                                <TextField label="Method Name" name="method" fullWidth value={harvestData.method} onChange={handleInputChange} sx={inputStyle} />
                                <TextField label="Time Required" name="time" fullWidth value={harvestData.time} onChange={handleInputChange} sx={inputStyle} />
                                <TextField label="Unit Cost" name="cost" fullWidth value={harvestData.cost} onChange={handleInputChange} sx={inputStyle} />
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<AppRegistration />}
                                    sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1e293b' } }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save Protocol"}
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Assignments</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Link protocols to your land assets.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: SAGE_LIGHT }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Target Farmland</InputLabel>
                                    <Select 
                                        value={selectedFarmland} 
                                        label="Target Farmland"
                                        onChange={(e) => setSelectedFarmland(e.target.value)}
                                    >
                                        {farmlands && farmlands.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Harvest Protocol</InputLabel>
                                    <Select 
                                        value={selectedHarvestMethod} 
                                        label="Harvest Protocol"
                                        onChange={(e) => setSelectedHarvestMethod(e.target.value)}
                                    >
                                        {harvestMethods && harvestMethods.map((m) => <MenuItem key={m.methodID} value={m.methodID}>{m.method}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1 }} />

                                <Button
                                    variant="outlined"
                                    onClick={handleAssignHarvest}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<SettingsSuggest />}
                                    sx={{ border: `2px solid ${SAGE_DARK}`, color: SAGE_DARK, py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                                >
                                    Confirm Assignment
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AddHarvestMethod;