import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Paper, Typography, TextField, Button, 
    FormControl, Select, MenuItem, Stack, Avatar, IconButton, Alert, Snackbar, CircularProgress
} from '@mui/material';
import FarmLandCard from '../../components/farmer/FarmLandCard.jsx';
import { useNic } from "../../components/NicContext.jsx";
import { 
    Agriculture, TrendingUp, Landscape, 
    NotificationsNone, AddCircle 
} from '@mui/icons-material';

// --- Theme Constants ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const SAGE_LIGHT = '#F4F7F5';      
const BORDER_COLOR = '#E5E2D9';    
const ACCENT_GREEN = '#27AE60';

const selectStyle = {
    borderRadius: '16px', 
    bgcolor: '#fff', 
    color: SAGE_DARK,
    border: `1px solid ${BORDER_COLOR}`,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': { py: 1.5, px: 2 }
};

const FarmerHome = () => {
    const { nic } = useNic() || { nic: null };
    
    // Data States
    const [cropedFarmland, setcropedFarmland] = useState([]);
    const [uncropedFarmland, setuncropedFarmland] = useState([]);
    const [crops, setCrops] = useState([]);
    
    // Form States
    const [name, setName] = useState('');
    const [variety, setVariety] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // --- Data Fetching ---
    const fetchData = async () => {
        if (!nic) return;
        try {
            const [res1, res2, res3] = await Promise.all([
                fetch(`http://localhost:8080/farmland/croped/${nic}`),
                fetch(`http://localhost:8080/farmland/uncroped/${nic}`),
                fetch('http://localhost:8080/crop/getAll')
            ]);
            setcropedFarmland(await res1.json());
            setuncropedFarmland(await res2.json());
            setCrops(await res3.json());
        } catch (error) {
            console.error("Fetch error:", error);
            showNotify("Could not connect to server", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, [nic]);

    // --- Action Handlers ---

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const handleRegisterAsset = async () => {
        if (!name || !variety) return showNotify("Please fill all fields", "warning");
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/crop/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, variety })
            });
            if (response.ok) {
                showNotify("New crop variety registered!", "success");
                setName(''); setVariety('');
                fetchData(); // Refresh list
            }
        } catch (e) { showNotify("Registration failed", "error"); }
        setLoading(false);
    };

    const handleInitiatePlanting = async () => {
        if (!selectedFarmland || !selectedCrop) return showNotify("Selection incomplete", "warning");
        setLoading(true);
        try {
            // Adjust this URL to match your backend planting endpoint
            const response = await fetch(`http://localhost:8080/farmland/plant/${selectedFarmland}/${selectedCrop}`, {
                method: 'PUT'
            });
            if (response.ok) {
                showNotify("Planting successfully initiated!", "success");
                setSelectedFarmland(''); setSelectedCrop('');
                fetchData(); // Refresh cards
            }
        } catch (e) { showNotify("Planting failed", "error"); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', p: { xs: 2, md: 4 }, color: SAGE_DARK }}>
            
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-1.5px' }}>
                        <Agriculture sx={{ fontSize: 38, color: ACCENT_GREEN }} />
                        CROP<span style={{ color: ACCENT_GREEN }}>MASTER</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, ml: 6.5 }}>
                        Farmer Portal • ID: {nic || "Guest"}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <IconButton sx={{ border: `1px solid ${BORDER_COLOR}` }}><NotificationsNone /></IconButton>
                    <Avatar sx={{ bgcolor: SAGE_DARK, width: 45, height: 45 }}>{nic ? nic.charAt(0) : 'F'}</Avatar>
                </Stack>
            </Stack>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    {/* Stats */}
                    <Stack direction="row" spacing={3} sx={{ mb: 5 }}>
                        <StatItem label="Active Plots" value={cropedFarmland.length} icon={<TrendingUp />} color={ACCENT_GREEN} />
                        <StatItem label="Available Land" value={uncropedFarmland.length} icon={<Landscape />} color="#E67E22" />
                    </Stack>

                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>Live Cultivations</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                        {cropedFarmland.map((f) => (
                            <Box key={f.farmlandID} sx={{ '& > div': { border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', borderRadius: '28px' } }}>
                                <FarmLandCard {...f} isCropped={true} />
                            </Box>
                        ))}
                    </Box>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        
                        {/* Deployment Panel */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: SAGE_LIGHT, border: `1px solid ${BORDER_COLOR}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Deploy New Crop</Typography>
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <Select displayEmpty value={selectedFarmland} onChange={(e) => setSelectedFarmland(e.target.value)} sx={selectStyle}>
                                        <MenuItem value="">Select Farmland</MenuItem>
                                        {uncropedFarmland.map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Select displayEmpty value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} sx={selectStyle}>
                                        <MenuItem value="">Select Crop Type</MenuItem>
                                        {crops.map(c => <MenuItem key={c.cropId} value={c.cropId}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    onClick={handleInitiatePlanting}
                                    disabled={loading}
                                    sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '16px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1a2621' } }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Initiate Planting"}
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Asset Registry */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: '#fff', border: `1px solid ${BORDER_COLOR}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Registry Asset</Typography>
                            <Stack spacing={2}>
                                <TextField 
                                    placeholder="Crop Name" 
                                    fullWidth 
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }}}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField 
                                    placeholder="Variety" 
                                    fullWidth 
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }}}
                                    value={variety}
                                    onChange={(e) => setVariety(e.target.value)}
                                />
                                <Button 
                                    fullWidth 
                                    startIcon={<AddCircle />}
                                    onClick={handleRegisterAsset}
                                    disabled={loading}
                                    sx={{ mt: 1, py: 1.5, borderRadius: '12px', color: SAGE_DARK, border: `1px solid ${SAGE_DARK}`, fontWeight: 700, textTransform: 'none' }}
                                >
                                    Register Asset
                                </Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>

            {/* Notifications */}
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
};

const StatItem = ({ label, value, icon, color }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', bgcolor: '#fff', border: `1px solid ${BORDER_COLOR}`, flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${color}15`, color: color }}>{icon}</Box>
        <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{value}</Typography>
        </Box>
    </Paper>
);

export default FarmerHome;