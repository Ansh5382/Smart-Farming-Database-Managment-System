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
    WaterDrop, 
    Opacity, 
    Construction 
} from '@mui/icons-material';

// --- CropMaster Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#0f172a';       
const SAGE_LIGHT = '#fdfcf0';      
const BORDER_COLOR = '#cad2c5';    
const ACCENT_BLUE = '#2E86C1'; // Irrigation accent

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

const AddIrrigationMethod = () => {
    const { nic } = useNic();
    
    // States
    const [irrigationData, setIrrigationData] = useState({ delivery: '', source: '', method: '', maintainerNIC: '' });
    const [farmers, setFarmers] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [irrigationMethods, setIrrigationMethods] = useState([]);
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [selectedIrrigation, setSelectedIrrigation] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const fetchData = async () => {
        if (!nic) return;
        setLoading(true);
        try {
            // First get farmer's owner context
            const resProfile = await fetch(`http://localhost:8080/farmer/${nic}`);
            if (!resProfile.ok) throw new Error("Could not fetch profile");
            const profile = await resProfile.json();
            const ownerNIC = profile?.ownerNIC;

            if (!ownerNIC) {
                console.warn("Farmer has no owner context");
                setLoading(false);
                return;
            }

            const [resFarmer, resLand, resIrr] = await Promise.all([
                fetch(`http://localhost:8080/farmer/byOwner/${ownerNIC}`),
                fetch(`http://localhost:8080/farmland/getAll/${nic}/${ownerNIC}`),
                fetch(`http://localhost:8080/irrigation/byFarmer/${nic}`)
            ]);
            
            if (resFarmer.ok) setFarmers(await resFarmer.json());
            if (resLand.ok) setFarmlands(await resLand.json());
            if (resIrr.ok) setIrrigationMethods(await resIrr.json());
        } catch (error) { 
            console.error("Fetch Error:", error);
            showNotify("Could not load data", "error");
        }
        setLoading(false);
    };

    useEffect(() => { if (nic) fetchData(); }, [nic]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIrrigationData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddIrrigation = async () => {
        if (!irrigationData.delivery || !irrigationData.source || !irrigationData.maintainerNIC) {
            return showNotify("Please fill all fields", "warning");
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/irrigation/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...irrigationData, farmerNIC: nic }),
            });
            if (res.ok) {
                showNotify('Irrigation Protocol Saved', 'success');
                setIrrigationData({ delivery: '', source: '', method: '', maintainerNIC: '' });
                fetchData();
            }
        } catch (e) { showNotify('Error saving system', 'error'); }
        setLoading(false);
    };

    const handleAssignIrrigation = async () => {
        if (!selectedFarmland || !selectedIrrigation) return showNotify("Selection incomplete", "warning");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/farmland/updateIrrigation/${selectedFarmland}/${selectedIrrigation}`, { method: 'PUT' });
            if (res.ok) {
                showNotify('System Assigned Successfully', 'success');
                setSelectedFarmland('');
                setSelectedIrrigation('');
            }
        } catch (e) { showNotify('Assignment failed', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK, overflowX: 'hidden' }}>
            
            {/* Top Navigation */}
            <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Irrigation Control
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    PORTAL: {nic || 'SECURE_ACCESS'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid container spacing={4}>
                    
                    {/* Left: New System Registry */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Systems</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Register new water delivery infrastructure.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Stack spacing={2.5}>
                                <TextField label="Delivery Type (e.g. Drip)" name="delivery" fullWidth value={irrigationData.delivery} onChange={handleInputChange} sx={inputStyle} />
                                <TextField label="Water Source" name="source" fullWidth value={irrigationData.source} onChange={handleInputChange} sx={inputStyle} />
                                <TextField label="Technical Method" name="method" fullWidth value={irrigationData.method} onChange={handleInputChange} sx={inputStyle} />
                                
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Maintainer NIC</InputLabel>
                                    <Select name="maintainerNIC" value={irrigationData.maintainerNIC} label="Maintainer NIC" onChange={handleInputChange}>
                                        {farmers.map((f) => <MenuItem key={f.nic} value={f.nic}>{f.name} ({f.nic})</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    onClick={handleAddIrrigation}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<WaterDrop />}
                                    sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1e293b' } }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save System"}
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right: Assignment */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Deployment</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Connect systems to specific land assets.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: SAGE_LIGHT }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Farmland</InputLabel>
                                    <Select value={selectedFarmland} label="Select Farmland" onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlands.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select System</InputLabel>
                                    <Select value={selectedIrrigation} label="Select System" onChange={(e) => setSelectedIrrigation(e.target.value)}>
                                        {irrigationMethods.map((m) => <MenuItem key={m.systemID} value={m.systemID}>{m.delivery} - {m.source}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1 }} />

                                <Button
                                    variant="outlined"
                                    onClick={handleAssignIrrigation}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<Construction />}
                                    sx={{ border: `2px solid ${SAGE_DARK}`, color: SAGE_DARK, py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                                >
                                    Assign Irrigation
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

export default AddIrrigationMethod;