import React, { useEffect, useState } from 'react';
import {
    Typography, TextField, Button, Container, Grid, Paper,
    FormControl, InputLabel, Select, MenuItem, Divider, Box,
    Stack, IconButton, CircularProgress, Snackbar, Alert, InputAdornment
} from '@mui/material';

// Fixed Icon Imports
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Construction from '@mui/icons-material/Construction';
import HistoryEdu from '@mui/icons-material/HistoryEdu';
import PrecisionManufacturing from '@mui/icons-material/PrecisionManufacturing';
import LocalShipping from '@mui/icons-material/LocalShipping';

import { useNic } from "../../components/NicContext.jsx";

// --- CropMaster Theme Palette ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const BORDER_COLOR = '#E5E2D9';    
const STEEL_BLUE = '#4682B4'; // Accent color for machinery

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        bgcolor: '#fff',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
        '&.Mui-focused fieldset': { borderColor: SAGE_DARK },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: SAGE_DARK }
};

const AddMachine = () => {
    const { nic } = useNic();

    const [machineData, setMachineData] = useState({
        name: '', cost: '', type: '', envir_impact: '', safely: '',
    });
    const [farmlandData, setFarmlandData] = useState([]);
    const [machineryData, setMachineryData] = useState([]);
    const [selectedMachinery, setSelectedMachinery] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const fetchData = async () => {
        try {
            const [resFarm, resMach] = await Promise.all([
                fetch(`http://localhost:8080/farmland/getAll/${nic}`),
                fetch('http://localhost:8080/machinery/getAll')
            ]);
            if (resFarm.ok) setFarmlandData(await resFarm.json());
            if (resMach.ok) setMachineryData(await resMach.json());
        } catch (error) { 
            console.error("Fetch Error:", error); 
        }
    };

    useEffect(() => { 
        if (nic) fetchData(); 
    }, [nic]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Map UI names back to your backend state keys
        const stateKey = name === 'environmentalImpact' ? 'envir_impact' : 
                         name === 'safety' ? 'safely' : name;
        
        setMachineData(prev => ({ ...prev, [stateKey]: value }));
    };

    const handleAddMachine = async () => {
        if (!machineData.name || !machineData.type) return showNotify("Machine Name and Type are required", "warning");
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/machinery/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(machineData),
            });
            if (res.ok) {
                showNotify('Asset successfully added to fleet', 'success');
                setMachineData({ name: '', cost: '', type: '', envir_impact: '', safely: '' });
                fetchData();
            }
        } catch (e) { showNotify('Failed to register machinery', 'error'); }
        setLoading(false);
    };

    const handleMachineUsageSubmit = async () => {
        if (!selectedFarmland || !selectedMachinery) return showNotify("Please select both field and machine", "warning");
        setLoading(true);
        try {
            const data = {
                farmlandID: selectedFarmland,
                machineryID: selectedMachinery,
                nic: nic,
                machineryName: machineryData.find(m => m.machineID === selectedMachinery)?.name,
                date: new Date().toISOString(),
            };
            const res = await fetch('http://localhost:8080/machineryusage/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                showNotify('Deployment activity logged', 'success');
                setSelectedMachinery('');
                setSelectedFarmland('');
            }
        } catch (e) { showNotify('Failed to log activity', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK }}>
            
            {/* Header Navigation */}
            <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Fleet & Equipment
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    OPERATOR NIC: {nic || '---'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    
                    {/* Registry Section */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <PrecisionManufacturing sx={{ color: SAGE_DARK }} />
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>Fleet Registry</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Add new assets to your farm's digital machinery database.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <TextField label="Machine Name" name="name" fullWidth value={machineData.name} onChange={handleInputChange} sx={inputStyle} placeholder="e.g. John Deere 8R" />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        label="Cost" name="cost" fullWidth value={machineData.cost} onChange={handleInputChange} sx={inputStyle} 
                                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Category/Type" name="type" fullWidth value={machineData.type} onChange={handleInputChange} sx={inputStyle} placeholder="e.g. Tractor, Seeder" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Environmental Rating" name="environmentalImpact" fullWidth value={machineData.envir_impact} onChange={handleInputChange} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Safety Protocols" name="safety" multiline rows={2} fullWidth value={machineData.safely} onChange={handleInputChange} sx={inputStyle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddMachine}
                                        disabled={loading}
                                        fullWidth
                                        startIcon={<Construction />}
                                        sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, mt: 1, '&:hover': { bgcolor: '#1a2621' }, boxShadow: 'none' }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Register Asset"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Deployment Section */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <LocalShipping sx={{ color: STEEL_BLUE }} />
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>Deployment Log</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Log which machine is currently active in which field.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#F4F7F5' }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Target Farmland</InputLabel>
                                    <Select value={selectedFarmland} label="Target Farmland" onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlandData.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Active Machinery</InputLabel>
                                    <Select value={selectedMachinery} label="Active Machinery" onChange={(e) => setSelectedMachinery(e.target.value)}>
                                        {machineryData.map((m) => <MenuItem key={m.machineID} value={m.machineID}>{m.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1 }} />

                                <Button
                                    variant="outlined"
                                    onClick={handleMachineUsageSubmit}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<HistoryEdu />}
                                    sx={{ border: `2px solid ${STEEL_BLUE}`, color: STEEL_BLUE, py: 2, borderRadius: '12px', fontWeight: 700, '&:hover': { border: `2px solid ${STEEL_BLUE}`, bgcolor: 'rgba(70, 130, 180, 0.05)' } }}
                                >
                                    Log Activity
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

export default AddMachine;