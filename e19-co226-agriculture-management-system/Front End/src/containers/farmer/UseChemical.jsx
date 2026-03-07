import React, { useEffect, useState } from 'react';
import {
    Typography, TextField, Button, Container, Grid, Paper,
    FormControl, InputLabel, Select, MenuItem, Divider, Box,
    Stack, IconButton, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useNic } from "../../components/NicContext.jsx";
import { 
    ChevronLeft, 
    Science, 
    Assignment, 
    WarningAmber, 
    ShieldMoon 
} from '@mui/icons-material';

// --- CropMaster Theme Palette ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const BORDER_COLOR = '#E5E2D9';    
const ACCENT_ORANGE = '#D35400'; // Safety/Chemical accent

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        bgcolor: '#fff',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
    }
};

const AddChemical = () => {
    const { nic } = useNic();

    // Form States
    const [chemicalData, setChemicalData] = useState({
        name: '', handling: '', usageInfo: '', safety: '', manufacturer: '', envir_impact: '',
    });
    const [selectedChemical, setSelectedChemical] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');

    // Data Lists
    const [farmlandData, setFarmlandData] = useState([]);
    const [chemData, setChemData] = useState([]);

    // UI Feedback
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const fetchData = async () => {
        try {
            const [resFarm, resChem] = await Promise.all([
                fetch(`http://localhost:8080/farmland/getAll/${nic}`),
                fetch('http://localhost:8080/chemical/getAll')
            ]);
            if (resFarm.ok) setFarmlandData(await resFarm.json());
            if (resChem.ok) setChemData(await resChem.json());
        } catch (error) { console.error("Fetch Error:", error); }
    };

    useEffect(() => { if (nic) fetchData(); }, [nic]);

    const handleChange = (field, value) => {
        setChemicalData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddChemical = async () => {
        if (!chemicalData.name || !chemicalData.manufacturer) return showNotify("Required fields missing", "warning");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/chemical/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chemicalData),
            });
            if (res.ok) {
                showNotify('Chemical registered successfully', 'success');
                setChemicalData({ name: '', handling: '', usageInfo: '', safety: '', manufacturer: '', envir_impact: '' });
                fetchData();
            }
        } catch (e) { showNotify('Registry failed', 'error'); }
        setLoading(false);
    };

    const handleChemicalUsageSubmit = async () => {
        if (!selectedFarmland || !selectedChemical) return showNotify("Please select land and chemical", "warning");
        setLoading(true);
        try {
            const data = {
                farmlandID: selectedFarmland,
                chemicalID: selectedChemical,
                nic: nic,
                chemicalName: chemData.find(c => c.chemicalID === selectedChemical)?.name,
                date: new Date().toISOString(),
            };
            const res = await fetch('http://localhost:8080/chemicalusage/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                showNotify('Usage reported successfully', 'success');
                setSelectedChemical('');
                setSelectedFarmland('');
            }
        } catch (e) { showNotify('Usage reporting failed', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK }}>
            
            {/* Top Navigation */}
            <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Chemical & Bio Control
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    ID: {nic || 'OFFLINE'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    
                    {/* Left side: Chemical Registry */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Chemical Registry</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Maintain the global safety and handling database.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Chemical Name" fullWidth value={chemicalData.name} onChange={(e) => handleChange('name', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Manufacturer" fullWidth value={chemicalData.manufacturer} onChange={(e) => handleChange('manufacturer', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Handling Instructions" fullWidth value={chemicalData.handling} onChange={(e) => handleChange('handling', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Safety Precautions" fullWidth value={chemicalData.safety} onChange={(e) => handleChange('safety', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Application Usage" fullWidth value={chemicalData.usageInfo} onChange={(e) => handleChange('usageInfo', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Environmental Impact" fullWidth value={chemicalData.envir_impact} onChange={(e) => handleChange('envir_impact', e.target.value)} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddChemical}
                                        disabled={loading}
                                        fullWidth
                                        startIcon={<Science />}
                                        sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, mt: 1 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Update Database"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Right side: Report Usage */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Field Application</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Log chemical usage on specific land assets.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#F4F7F5' }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Farmland</InputLabel>
                                    <Select value={selectedFarmland} label="Select Farmland" onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlandData.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Substance</InputLabel>
                                    <Select value={selectedChemical} label="Select Substance" onChange={(e) => setSelectedChemical(e.target.value)}>
                                        {chemData.map((c) => <MenuItem key={c.chemicalID} value={c.chemicalID}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1 }}>
                                    <WarningAmber sx={{ color: ACCENT_ORANGE }} />
                                </Divider>

                                <Button
                                    variant="outlined"
                                    onClick={handleChemicalUsageSubmit}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<Assignment />}
                                    sx={{ border: `2px solid ${ACCENT_ORANGE}`, color: ACCENT_ORANGE, py: 2, borderRadius: '12px', fontWeight: 700, '&:hover': { border: `2px solid ${ACCENT_ORANGE}`, bgcolor: 'rgba(211, 84, 0, 0.05)' } }}
                                >
                                    Report Field Usage
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

export default AddChemical;