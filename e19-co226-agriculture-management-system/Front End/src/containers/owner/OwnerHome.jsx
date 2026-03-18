import React, { useState, useEffect } from 'react';
import { 
    Box, Divider, Paper, Typography, Container, Grid, 
    Card, CardContent, Stack, Avatar, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    Snackbar, Alert, CircularProgress, IconButton, FormControl, Select, MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import FarmlandDetailsCard from "../../components/owner/FarmlandDetailsCard.jsx";
import { useNic } from "../../components/NicContext.jsx";

// Icons for a modern dashboard feel
import Landscape from '@mui/icons-material/Landscape';
import Grass from '@mui/icons-material/Grass';
import People from '@mui/icons-material/People';
import Engineering from '@mui/icons-material/Engineering';
import Analytics from '@mui/icons-material/Analytics';
import Terrain from '@mui/icons-material/Terrain';
import CloseIcon from '@mui/icons-material/Close';

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
    return (
        <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s ease',
            cursor: 'default',
            borderColor: 'divider',
            '&:hover': { 
                transform: 'translateY(-6px)', 
                borderColor: color,
                boxShadow: `0 12px 24px -8px ${color}40`
            }
        }}>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 56, height: 56 }}>
                        <Icon fontSize="medium" />
                    </Avatar>
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {title}
                        </Typography>
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                {value}
                            </Typography>
                        </motion.div>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

const Home = () => {
    const [farmlands, setFarmlands] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [crops, setCrops] = useState([]);
    const theme = useTheme();

    const [selectedFarmland, setSelectedFarmland] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [soilData, setSoilData] = useState(null);
    const [diseaseData, setDiseaseData] = useState(null);
    const [chemicalData, setChemicalData] = useState(null);
    const [machineData, setMachineData] = useState(null);

    const [notify, setNotify] = useState({ open: false, msg: '', sev: 'success' });
    const { nic: ownerNIC } = useNic();

    const showNotify = (msg, sev = 'success') => setNotify({ open: true, msg, sev });

    useEffect(() => {
        if (!ownerNIC) return;

        fetch(`http://localhost:8080/farmland/byOwner/${ownerNIC}`)
            .then((res) => res.json())
            .then((data) => setFarmlands(data))
            .catch((err) => console.error('Farmland Fetch Error:', err));

        fetch(`http://localhost:8080/farmer/byOwner/${ownerNIC}`)
            .then((res) => res.json())
            .then((data) => setFarmers(data))
            .catch((err) => console.error('Farmer Fetch Error:', err));

        fetch('http://localhost:8080/crop/getAll')
            .then((res) => res.json())
            .then((data) => setCrops(data))
            .catch((err) => console.error('Crop Fetch Error:', err));
    }, [ownerNIC]);

    useEffect(() => {
        if (selectedFarmland) {
            const id = selectedFarmland.farmlandID;
            if (selectedFarmland.cropID !== 0) {
                fetch(`http://localhost:8080/weather/getDetails/${id}`).then(res => res.json()).then(setWeatherData).catch(console.error);
                fetch(`http://localhost:8080/soil/getDetails/${id}`).then(res => res.json()).then(setSoilData).catch(console.error);
                fetch(`http://localhost:8080/hostcrop/getDisease/${id}`).then(res => res.json()).then(setDiseaseData).catch(console.error);
                fetch(`http://localhost:8080/chemicalusage/getChemical/${id}`).then(res => res.json()).then(setChemicalData).catch(console.error);
                fetch(`http://localhost:8080/machineryusage/getMachinery/${id}`).then(res => res.json()).then(setMachineData).catch(console.error);
            } else {
                setWeatherData(null); setSoilData(null); setDiseaseData(null); setChemicalData(null); setMachineData(null);
            }
        }
    }, [selectedFarmland]);

    // Logic for Statistics
    const currentFarmlands = Array.isArray(farmlands) ? farmlands : [];
    const currentFarmers = Array.isArray(farmers) ? farmers : [];
    const currentCrops = Array.isArray(crops) ? crops : [];

    const totalFarmlands = currentFarmlands.length;
    const croppedFarmlands = currentFarmlands.filter((f) => f && f.cropID !== 0).length;
    const uncroppedFarmlands = Math.max(0, totalFarmlands - croppedFarmlands);
    const totalFarmers = currentFarmers.length;
    const experiencedFarmers = currentFarmers.filter((f) => f && f.experince && f.experince !== '').length;
    const inexperienciedFarmers = Math.max(0, totalFarmers - experiencedFarmers);

    // Crop Breakdown
    const cropCounts = currentFarmlands.reduce((acc, f) => {
        if (f && f.cropID && f.cropID !== 0) {
            acc[f.cropID] = (acc[f.cropID] || 0) + 1;
        }
        return acc;
    }, {});

    const getCropName = (id) => {
        const crop = currentCrops.find(c => (c.cropId === id || c.cropID === id));
        return crop?.name || `Variety #${id}`;
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary', overflowX: 'hidden' }}>
            <Container maxWidth="xl" component={motion.div} variants={containerParams} initial="hidden" animate="show">
                
                {/* Insights Summary Helper */}
                {selectedFarmland && selectedFarmland.cropID !== 0 && (
                    <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ mt: -4, mb: 4 }}>
                         <Alert severity="info" variant="outlined" sx={{ borderRadius: '16px', border: `1px solid ${theme.palette.primary.main}40`, bgcolor: `${theme.palette.primary.main}08` }}>
                            Viewing real-time insights for <strong>{selectedFarmland.name}</strong> • Growing <strong>{getCropName(selectedFarmland.cropID)}</strong>
                        </Alert>
                    </Box>
                )}

                {/* Dashboard Header */}
                <Box component={motion.div} variants={itemParams} sx={{ mb: 6 }}>
                    <Typography variant="overline" sx={{ fontWeight: 700, color: theme.palette.secondary.main, letterSpacing: 2 }}>
                        Management Overview
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: '-1px' }}>
                        Owner Dashboard
                    </Typography>
                    <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}>
                        <Divider sx={{ height: 4, bgcolor: theme.palette.secondary.main, mt: 2, borderRadius: 1, border: 'none' }} />
                    </motion.div>
                </Box>

                {/* Statistics Grid */}
                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {[
                        { title: "Total Farmlands", value: totalFarmlands, icon: Terrain, color: theme.palette.neutral.normal },
                        { title: "Cultivated Land", value: croppedFarmlands, icon: Grass, color: theme.palette.primary.main },
                        { title: "Fallow Land", value: uncroppedFarmlands, icon: Landscape, color: theme.palette.warning.main },
                        { title: "Total Farmers", value: totalFarmers, icon: People, color: theme.palette.secondary.main },
                        { title: "Expert Personnel", value: experiencedFarmers, icon: Engineering, color: theme.palette.error.main },
                        { title: "Support Staff", value: inexperienciedFarmers, icon: Analytics, color: theme.palette.info.main }
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} component={motion.div} variants={itemParams}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <StatCard {...stat} />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Land Distribution Section */}
                <Box component={motion.div} variants={itemParams} sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Land Distribution Details</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Live monitoring of all registered agricultural assets.</Typography>
                </Box>
                
                <motion.div variants={itemParams}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', height: '100%' }}>
                                <FarmlandDetailsCard 
                                    farmlands={farmlands} 
                                    selectedFarmland={selectedFarmland} 
                                    setSelectedFarmland={setSelectedFarmland}
                                    weatherData={weatherData}
                                    soilData={soilData}
                                    diseaseData={diseaseData}
                                    chemicalData={chemicalData}
                                    machineData={machineData}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${theme.palette.divider}`, bgcolor: '#fff', height: '100%', position: 'relative' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Analytics color="primary" /> {selectedFarmland ? 'Land Insights' : 'Cultivation Insights'}
                                    </Typography>
                                </Stack>

                                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                    <Select
                                        value={selectedFarmland?.farmlandID || ""}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            if (id === "") setSelectedFarmland(null);
                                            else setSelectedFarmland(farmlands.find(f => f.farmlandID === id));
                                        }}
                                        displayEmpty
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Global Crop Distribution</MenuItem>
                                        {currentFarmlands.map(f => (
                                            <MenuItem key={f.farmlandID} value={f.farmlandID}>
                                                {f.name || 'Unnamed Land'} {f.cropID !== 0 ? '(Active)' : '(Fallow)'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {selectedFarmland ? (
                                    selectedFarmland.cropID !== 0 ? (
                                        <Stack spacing={2.5}>
                                            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                                                <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, textTransform: 'uppercase' }}>Active Crop</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{getCropName(selectedFarmland.cropID)}</Typography>
                                            </Box>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <InsightMiniCard label="Temp" value={weatherData?.temperature || '--'} unit="°C" color={theme.palette.warning.main} />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <InsightMiniCard label="Soil pH" value={soilData?.ph || '--'} color={theme.palette.info.main} />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <InsightMiniCard label="Humidity" value={weatherData?.humidity || '--'} unit="%" color={theme.palette.primary.main} />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <InsightMiniCard label="Rain" value={weatherData?.rainfall || '--'} unit="mm" color={theme.palette.secondary.main} />
                                                </Grid>
                                            </Grid>

                                            {diseaseData?.length > 0 && (
                                                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'error.main', color: 'white' }}>
                                                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>DISEASE ALERT</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{diseaseData[0].diseaseName}</Typography>
                                                </Box>
                                            )}

                                            <Button 
                                                variant="outlined" 
                                                fullWidth 
                                                onClick={() => setSelectedFarmland(null)}
                                                sx={{ borderRadius: '12px', mt: 1 }}
                                            >
                                                Back to Global View
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <Landscape sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                No crops currently planted on <strong>{selectedFarmland.name}</strong>.
                                            </Typography>
                                            <Button variant="text" size="small" onClick={() => setSelectedFarmland(null)} sx={{ mt: 2 }}>Reset Selection</Button>
                                        </Box>
                                    )
                                ) : (
                                    <Stack spacing={2}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>CROP DISTRIBUTION</Typography>
                                        {Object.entries(cropCounts).map(([cid, count]) => (
                                            <Box key={cid}>
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{getCropName(parseInt(cid))}</Typography>
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>{count} Plots</Typography>
                                                </Stack>
                                                <Box sx={{ height: 6, width: '100%', bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${(count / croppedFarmlands) * 100}%` }} 
                                                        style={{ height: '100%', background: theme.palette.primary.main }} 
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                        {croppedFarmlands === 0 && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                                                No active cultivations to analyze.
                                            </Typography>
                                        )}
                                        <Typography variant="caption" sx={{ mt: 2, color: 'text.disabled', textAlign: 'center', fontStyle: 'italic' }}>
                                            Select a land plot for specific insights
                                        </Typography>
                                    </Stack>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>

                <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({ ...notify, open: false })}>
                    <Alert severity={notify.sev} variant="filled" sx={{ width: '100%' }}>{notify.msg}</Alert>
                </Snackbar>

            </Container>
        </Box>
    );
};

// Sub-component for Land Insights
const InsightMiniCard = ({ label, value, unit = "", color }) => (
    <Box sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: color, lineHeight: 1.2 }}>
            {value}<span style={{ fontSize: '12px', marginLeft: '2px' }}>{unit}</span>
        </Typography>
    </Box>
);

export default Home;