import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Paper, Typography, TextField, Button, 
    FormControl, Select, MenuItem, Stack, Avatar, IconButton, Divider 
} from '@mui/material';
import FarmLandCard from '../../components/farmer/FarmLandCard.jsx';
import { useNic } from "../../components/NicContext.jsx";

// Icons
import Agriculture from '@mui/icons-material/Agriculture';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Landscape from '@mui/icons-material/Landscape';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import AddCircle from '@mui/icons-material/AddCircle';
import HistoryEdu from '@mui/icons-material/HistoryEdu';

// --- CropMaster Theme Palette ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const BORDER_COLOR = '#E5E2D9';    
const ACCENT_GREEN = '#8BA888';
const DARK_MOSS = '#1a2621';

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        bgcolor: '#fff',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
        '&.Mui-focused fieldset': { borderColor: SAGE_DARK },
    }
};

const FarmerHome = () => {
    const { nic } = useNic();
    
    const [cropedFarmland, setcropedFarmland] = useState([]);
    const [uncropedFarmland, setuncropedFarmland] = useState([]);
    const [name, setName] = useState('');
    const [variety, setVariety] = useState('');
    const [crops, setCrops] = useState([]);
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [selectedCrop, setSelectedCrop] = useState('');

    useEffect(() => {
        if (!nic) return;
        const fetchData = async () => {
            try {
                const [res1, res2, res3] = await Promise.all([
                    fetch(`http://localhost:8080/farmland/croped/${nic}`),
                    fetch(`http://localhost:8080/farmland/uncroped/${nic}`),
                    fetch('http://localhost:8080/crop/getAll')
                ]);
                setcropedFarmland(await res1.json());
                setuncropedFarmland(await res2.json());
                setCrops(await res3.json());
            } catch (error) { console.error("Fetch error:", error); }
        };
        fetchData();
    }, [nic]);

    const handleRegisterAsset = () => {
        if(!name || !variety) return alert("Please fill all fields");
        // Logic for registering new crop variety
        console.log("Registering:", name, variety);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', p: { xs: 2, md: 4 }, color: SAGE_DARK }}>
            
            {/* Header Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-1px' }}>
                        <Agriculture sx={{ fontSize: 40, color: SAGE_DARK }} />
                        FIELD COMMAND
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, ml: 7, textTransform: 'uppercase' }}>
                        OPERATOR ID: {nic || "GUEST_SESSION"}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <IconButton sx={{ border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}><NotificationsNone /></IconButton>
                    <Avatar sx={{ bgcolor: SAGE_DARK, fontWeight: 700 }}>{nic ? nic.charAt(0) : 'F'}</Avatar>
                </Stack>
            </Stack>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    
                    {/* --- CREATIVE STATUS HUB --- */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={7}>
                            <Paper elevation={0} sx={{ 
                                p: 4, height: '100%', borderRadius: '32px', 
                                background: `linear-gradient(135deg, ${SAGE_DARK} 0%, ${DARK_MOSS} 100%)`,
                                color: '#fff', position: 'relative', overflow: 'hidden',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center'
                            }}>
                                <Stack spacing={1}>
                                    <Typography variant="overline" sx={{ opacity: 0.7, fontWeight: 700, letterSpacing: 2 }}>
                                        Land Utilization
                                    </Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 950, lineHeight: 1 }}>
                                        {cropedFarmland.length + uncropedFarmland.length}
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>Total Managed Plots</Typography>
                                    
                                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2, border: 'none', height: '1px' }} />
                                    
                                    <Stack direction="row" spacing={4}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: ACCENT_GREEN }}>{cropedFarmland.length}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>CULTIVATED</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#F39C12' }}>{uncropedFarmland.length}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>AVAILABLE</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                                <Agriculture sx={{ 
                                    position: 'absolute', right: -30, bottom: -30, 
                                    fontSize: 220, opacity: 0.05, transform: 'rotate(-15deg)' 
                                }} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Stack spacing={2} sx={{ height: '100%' }}>
                                <Paper elevation={0} sx={{ p: 3, flex: 1, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar sx={{ bgcolor: `${ACCENT_GREEN}15`, color: ACCENT_GREEN, width: 56, height: 56 }}>
                                        <TrendingUp fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900 }}>82%</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>SOIL PRODUCTIVITY</Typography>
                                    </Box>
                                </Paper>
                                <Paper elevation={0} sx={{ p: 3, flex: 1, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: '#F4F7F5', borderRadius: '12px' }}>
                                        <HistoryEdu sx={{ color: SAGE_DARK }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Recent Activity</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Plot A-12 • Fertilized • 4h ago</Typography>
                                    </Box>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Active Plots List */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>Live Cultivations</Typography>
                        <Typography variant="body2" sx={{ color: ACCENT_GREEN, fontWeight: 700 }}>View All Plots</Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                        {cropedFarmland.map((f) => (
                            <Grid item xs={12} sm={6} key={f.farmlandID}>
                                <Box sx={{ 
                                    '& > div': { 
                                        border: `1px solid ${BORDER_COLOR}`, 
                                        bgcolor: '#fff', 
                                        borderRadius: '28px', 
                                        boxShadow: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { borderColor: SAGE_DARK, transform: 'translateY(-5px)' }
                                    } 
                                }}>
                                    <FarmLandCard {...f} isCropped={true} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* --- Sidebar Panels --- */}
                <Grid item xs={12} lg={4}>
                    <Stack spacing={3}>
                        
                        {/* Deployment Panel */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: '#F4F7F5', border: `1px solid ${BORDER_COLOR}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Landscape sx={{ color: SAGE_DARK }} /> Deploy New Crop
                            </Typography>
                            <Stack spacing={2.5}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <Select displayEmpty value={selectedFarmland} onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        <MenuItem value="">Select Target Plot</MenuItem>
                                        {uncropedFarmland.map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={inputStyle}>
                                    <Select displayEmpty value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                                        <MenuItem value="">Select Crop Variety</MenuItem>
                                        {crops.map(c => <MenuItem key={c.cropId} value={c.cropId}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button fullWidth variant="contained" sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '16px', fontWeight: 700, '&:hover': { bgcolor: DARK_MOSS } }}>
                                    Initiate Planting Cycle
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Quick Registry */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: '#fff', border: `1px solid ${BORDER_COLOR}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Quick Registry</Typography>
                            <Stack spacing={2}>
                                <TextField placeholder="Crop Species" fullWidth sx={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                                <TextField placeholder="Sub-Variety" fullWidth sx={inputStyle} value={variety} onChange={(e) => setVariety(e.target.value)} />
                                <Button fullWidth startIcon={<AddCircle />} onClick={handleRegisterAsset} sx={{ mt: 1, py: 1.5, borderRadius: '12px', color: SAGE_DARK, border: `2px solid ${SAGE_DARK}`, fontWeight: 800 }}>
                                    Add to Database
                                </Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FarmerHome;