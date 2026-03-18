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
    BugReport, 
    Biotech, 
    HealthAndSafety 
} from '@mui/icons-material';

// --- CropMaster Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#0f172a';       
const SAGE_LIGHT = '#fdfcf0';      
const BORDER_COLOR = '#cad2c5';    
const ACCENT_RED = '#C0392B'; // Disease/Warning accent

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

export default function ReportDisease() {
    const { nic } = useNic();

    // Form States
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [symptom, setSymptom] = useState('');

    // Selection States
    const [selectedDisease, setSelectedDisease] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [farmlandData, setFarmlandData] = useState([]);
    const [diseaseData, setDiseaseData] = useState([]);

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

            const [resFarm, resDisease] = await Promise.all([
                fetch(`http://localhost:8080/farmland/getAll/${nic}/${ownerNIC}`),
                fetch(`http://localhost:8080/disease/byFarmer/${nic}`)
            ]);
            if (resFarm.ok) setFarmlandData(await resFarm.json());
            if (resDisease.ok) setDiseaseData(await resDisease.json());
        } catch (error) { console.error("Fetch Error:", error); }
    };

    useEffect(() => { if (nic) fetchData(); }, [nic]);

    // Action: Add New Disease to DB
    const handleSubmit = async () => {
        if (!name || !type || !symptom) return showNotify("Please fill disease details", "warning");
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/disease/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, symptom, transmission, farmerNIC: nic }),
            });
            if (response.ok) {
                showNotify('New disease registered in database', 'success');
                setName(''); setType(''); setSymptom(''); setTransmission('');
                fetchData();
            }
        } catch (e) { showNotify('Submission failed', 'error'); }
        setLoading(false);
    };

    // Action: Report Incident on Farmland
    const handleDiseaseReport = async () => {
        if (!selectedFarmland || !selectedDisease) return showNotify("Selection incomplete", "warning");
        setLoading(true);
        try {
            const data = {
                farmlandID: selectedFarmland,
                diseaseID: selectedDisease,
                nic: nic,
                diseaseName: diseaseData.find(d => d.diseaseID === selectedDisease)?.name,
                date: new Date().toISOString(),
            };
            const response = await fetch('http://localhost:8080/hostcrop/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                showNotify('Incident reported successfully', 'success');
                setSelectedFarmland(''); setSelectedDisease('');
                fetchData();
            }
        } catch (e) { showNotify('Reporting failed', 'error'); }
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
                        Pathology Control
                    </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    MONITORING: {nic || 'GUEST_SESSION'}
                </Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid container spacing={4}>
                    
                    {/* Left: Register New Disease */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Disease Registry</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Add unidentified pathogens to the global database.</Typography>
                        </Box>
                        
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                            <Stack spacing={2.5}>
                                <TextField label="Disease Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={inputStyle} />
                                <TextField label="Pathogen Type (Fungal, Viral, etc.)" fullWidth value={type} onChange={(e) => setType(e.target.value)} sx={inputStyle} />
                                <TextField label="Transmission Method" fullWidth value={transmission} onChange={(e) => setTransmission(e.target.value)} sx={inputStyle} />
                                <TextField label="Visual Symptoms" multiline rows={2} fullWidth value={symptom} onChange={(e) => setSymptom(e.target.value)} sx={inputStyle} />
                                
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<Biotech />}
                                    sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1e293b' } }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Register Pathogen"}
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Right: Report Incident */}
                    <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Incident Reporting</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Log an active outbreak on your farmland assets.</Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: SAGE_LIGHT }}>
                            <Stack spacing={3}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Affected Farmland</InputLabel>
                                    <Select value={selectedFarmland} label="Affected Farmland" onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlandData.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Identified Disease</InputLabel>
                                    <Select value={selectedDisease} label="Identified Disease" onChange={(e) => setSelectedDisease(e.target.value)}>
                                        {diseaseData.map((d) => <MenuItem key={d.diseaseID} value={d.diseaseID}>{d.name}</MenuItem>)}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 1, borderColor: BORDER_COLOR }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800 }}>URGENT ACTION</Typography>
                                </Divider>

                                <Button
                                    variant="outlined"
                                    onClick={handleDiseaseReport}
                                    disabled={loading}
                                    fullWidth
                                    startIcon={<BugReport />}
                                    sx={{ border: `2px solid ${ACCENT_RED}`, color: ACCENT_RED, py: 2, borderRadius: '12px', fontWeight: 700, textTransform: 'none', '&:hover': { border: `2px solid ${ACCENT_RED}`, bgcolor: 'rgba(192, 57, 43, 0.05)' } }}
                                >
                                    Report Outbreak
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '12px' }}>{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
}