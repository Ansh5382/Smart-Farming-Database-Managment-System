import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Paper, Typography, TextField, Button, 
    FormControl, Select, MenuItem, Stack, Avatar, IconButton, Alert, Snackbar, CircularProgress, useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FarmLandCard from '../../components/farmer/FarmLandCard.jsx';
import { useNic } from "../../components/NicContext.jsx";
import { 
    Agriculture, TrendingUp, Landscape, 
    NotificationsNone, AddCircle 
} from '@mui/icons-material';

const selectStyle = {
    bgcolor: 'background.paper', 
    color: 'text.primary',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
    '& .MuiSelect-select': { py: 1.5, px: 2 }
};

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const headerParams = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const FarmerHome = () => {
    const { nic } = useNic() || { nic: null };
    const theme = useTheme();
    
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
        setLoading(true);
        try {
            // Fetch farmer's profile to get their ownerNIC
            const resProfile = await fetch(`http://localhost:8080/farmer/${nic}`);
            if (!resProfile.ok) throw new Error("Could not fetch profile");
            const profile = await resProfile.json();
            
            const ownerNIC = profile?.ownerNIC;
            if (!ownerNIC) {
                console.warn("Farmer has no associated ownerNIC");
                setcropedFarmland([]);
                setuncropedFarmland([]);
                // Still fetch crops as they are registered by farmer
                const resCrops = await fetch(`http://localhost:8080/crop/byFarmer/${nic}`);
                if (resCrops.ok) setCrops(await resCrops.json());
                setLoading(false);
                return;
            }

            const [res1, res2, res3] = await Promise.all([
                fetch(`http://localhost:8080/farmland/croped/${nic}/${ownerNIC}`),
                fetch(`http://localhost:8080/farmland/uncroped/${nic}/${ownerNIC}`),
                fetch(`http://localhost:8080/crop/byFarmer/${nic}`)
            ]);
            
            if (res1.ok) setcropedFarmland(await res1.json());
            if (res2.ok) setuncropedFarmland(await res2.json());
            if (res3.ok) setCrops(await res3.json());
        } catch (error) {
            console.error("Fetch error:", error);
            showNotify("Could not connect to server", "error");
        }
        setLoading(false);
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
                body: JSON.stringify({ name, variety, farmerNIC: nic })
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
            const response = await fetch(`http://localhost:8080/farmland/updateCrop/${selectedFarmland}/${selectedCrop}`, {
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
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: { xs: 2, md: 4 }, color: 'text.primary', overflowX: 'hidden' }}>
            
            {/* Header */}
            <Stack 
                component={motion.div} 
                variants={headerParams} 
                initial="hidden" 
                animate="show"
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 6 }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-1px' }}>
                        <Agriculture sx={{ fontSize: 38, color: 'primary.main' }} />
                        CROP<span style={{ color: theme.palette.primary.main }}>MASTER</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, ml: 6 }}>
                        Farmer Portal • ID: {nic || "Guest"}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton sx={{ border: `1px solid`, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <NotificationsNone />
                    </IconButton>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 45, height: 45, fontWeight: 700 }}>{nic ? nic.charAt(0) : 'F'}</Avatar>
                </Stack>
            </Stack>

            <Grid container spacing={4} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid item xs={12} lg={8}>
                    {/* Stats */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 5 }}>
                        <motion.div variants={itemParams} style={{ flex: 1 }}>
                            <StatItem label="Active Plots" value={cropedFarmland.length} icon={<TrendingUp />} color={theme.palette.primary.main} />
                        </motion.div>
                        <motion.div variants={itemParams} style={{ flex: 1 }}>
                            <StatItem label="Available Land" value={uncropedFarmland.length} icon={<Landscape />} color={theme.palette.warning.main} />
                        </motion.div>
                    </Stack>

                    <motion.div variants={itemParams}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Live Cultivations</Typography>
                    </motion.div>

                    <Box 
                        component={motion.div} 
                        variants={containerParams}
                        sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}
                    >
                        <AnimatePresence>
                            {cropedFarmland.length > 0 ? (
                                cropedFarmland.map((f, index) => (
                                    <motion.div 
                                        key={f.farmlandID} 
                                        variants={itemParams}
                                        layout
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        style={{ 
                                            backgroundColor: theme.palette.background.paper, 
                                            borderRadius: '16px', 
                                            border: `1px solid ${theme.palette.divider}`, 
                                            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' 
                                        }}
                                    >
                                        <FarmLandCard {...f} isCropped={true} displayIndex={index + 1} />
                                    </motion.div>
                                ))
                            ) : (
                                !loading && (
                                    <Box sx={{ gridColumn: '1 / -1', py: 10, textAlign: 'center', opacity: 0.5 }}>
                                        <Typography variant="h6">No active cultivations found</Typography>
                                        <Typography variant="body2">Assigned plots will appear here.</Typography>
                                    </Box>
                                )
                            )}
                        </AnimatePresence>
                    </Box>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        
                        {/* Deployment Panel */}
                        <motion.div variants={itemParams}>
                            <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Deploy New Crop</Typography>
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
                                        color="primary"
                                        onClick={handleInitiatePlanting}
                                        disabled={loading}
                                        sx={{ py: 1.5, borderRadius: '12px', fontWeight: 600, mt: 1 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Initiate Planting"}
                                    </Button>
                                </Stack>
                            </Paper>
                        </motion.div>

                        {/* Asset Registry */}
                        <motion.div variants={itemParams}>
                            <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Register Asset</Typography>
                                <Stack spacing={2}>
                                    <TextField 
                                        placeholder="Crop Name" 
                                        fullWidth 
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <TextField 
                                        placeholder="Variety" 
                                        fullWidth 
                                        variant="outlined"
                                        value={variety}
                                        onChange={(e) => setVariety(e.target.value)}
                                    />
                                    <Button 
                                        fullWidth 
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<AddCircle />}
                                        onClick={handleRegisterAsset}
                                        disabled={loading}
                                        sx={{ py: 1.5, borderRadius: '12px', fontWeight: 600, mt: 1 }}
                                    >
                                        Register Asset
                                    </Button>
                                </Stack>
                            </Paper>
                        </motion.div>
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
    <Paper sx={{ p: 3, borderRadius: '20px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', flex: 1, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${color}15`, color: color }}>{icon}</Box>
        <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>{value}</Typography>
        </Box>
    </Paper>
);

export default FarmerHome;