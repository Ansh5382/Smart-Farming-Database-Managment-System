import React, { useState, useEffect } from 'react';
import {
    Typography, Select, MenuItem, Button, Container, Box,
    Paper, TextField, InputLabel, FormControl, Stack, Alert, 
    Snackbar, CircularProgress, IconButton, Divider, Grid, InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNic } from "../../components/NicContext.jsx";
import { 
    ChevronLeft, 
    Warehouse, 
    Thermostat, 
    InvertColors, 
    AssignmentTurnedIn 
} from '@mui/icons-material';

// --- CropMaster Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#0f172a';       
const SAGE_LIGHT = '#fdfcf0';      
const BORDER_COLOR = '#cad2c5';    

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

const AddStorageMethod = () => {
    const { nic } = useNic();

    // Data States
    const [storageData, setStorageData] = useState({
        name: '', location: '', capacity: '', humidity: '', temperature: '',
    });
    const [storageMethods, setStorageMethods] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [selectedStorageMethod, setSelectedStorageMethod] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');

    // UI States
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const fetchData = async () => {
        try {
            // First get farmer's owner context
            const resProfile = await fetch(`http://localhost:8080/farmer/${nic}`);
            if (!resProfile.ok) throw new Error("Could not fetch profile");
            const profile = await resProfile.json();
            const ownerNIC = profile.ownerNIC;

            const [resStorage, resLands] = await Promise.all([
                fetch(`http://localhost:8080/storage/byFarmer/${nic}`),
                fetch(`http://localhost:8080/farmland/getAll/${nic}/${ownerNIC}`)
            ]);
            if (resStorage.ok) setStorageMethods(await resStorage.json());
            if (resLands.ok) setFarmlands(await resLands.json());
        } catch (error) { console.error("Fetch Error:", error); }
    };

    useEffect(() => { if (nic) fetchData(); }, [nic]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStorageData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!storageData.name || !storageData.location) return showNotify("Name and Location are required", "warning");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/storage/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...storageData, farmerNIC: nic }),
            });
            if (res.ok) {
                showNotify('Storage Facility Registered', 'success');
                setStorageData({ name: '', location: '', capacity: '', humidity: '', temperature: '' });
                fetchData();
            }
        } catch (e) { showNotify('Failed to add storage', 'error'); }
        setLoading(false);
    };

    const handleAssignStorage = async () => {
        if (!selectedFarmland || !selectedStorageMethod) return showNotify("Please select both land and facility", "warning");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/farmland/updateStorage/${selectedFarmland}/${selectedStorageMethod}`, { method: 'PUT' });
            if (res.ok) {
                showNotify('Storage successfully assigned', 'success');
                setSelectedFarmland('');
                setSelectedStorageMethod('');
            }
        } catch (e) { showNotify('Assignment failed', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK, overflowX: 'hidden' }}>
            
            {/* Minimal Navigation Header */}
            <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Inventory Logistics
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    USER: {nic || 'LOGGED_IN'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid container spacing={4}>
                    
                    {/* Left side: Add Facility */}
                    <Grid item xs={12} md={7} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Facility Registry</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Create new storage environments with specific climate controls.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Facility Name" name="name" fullWidth value={storageData.name} onChange={handleInputChange} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Geo Location" name="location" fullWidth value={storageData.location} onChange={handleInputChange} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField label="Capacity" name="capacity" fullWidth value={storageData.capacity} onChange={handleInputChange} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        label="Humidity" name="humidity" fullWidth value={storageData.humidity} onChange={handleInputChange} sx={inputStyle} 
                                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        label="Temp" name="temperature" fullWidth value={storageData.temperature} onChange={handleInputChange} sx={inputStyle} 
                                        InputProps={{ endAdornment: <InputAdornment position="end">°C</InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        fullWidth
                                        startIcon={<Warehouse />}
                                        sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, mt: 1, '&:hover': { bgcolor: '#1e293b' } }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Register Facility"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Right side: Assign Facility */}
                    <Grid item xs={12} md={5} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Deployment</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Assign assets to storage units.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: SAGE_LIGHT }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Target Farmland</InputLabel>
                                    <Select value={selectedFarmland} label="Target Farmland" onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlands.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Storage Facility</InputLabel>
                                    <Select value={selectedStorageMethod} label="Storage Facility" onChange={(e) => setSelectedStorageMethod(e.target.value)}>
                                        {storageMethods.map((m) => <MenuItem key={m.storageID} value={m.storageID}>{m.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1 }} />

                                <Button
                                    variant="outlined"
                                    onClick={handleAssignStorage}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<AssignmentTurnedIn />}
                                    sx={{ border: `2px solid ${SAGE_DARK}`, color: SAGE_DARK, py: 2, borderRadius: '12px', fontWeight: 700 }}
                                >
                                    Confirm Assignment
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '12px' }}>{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AddStorageMethod;