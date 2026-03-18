import React, { useState, useEffect } from 'react';
import {
    Typography, Select, MenuItem, Button, Container, Box,
    Paper, TextField, InputLabel, FormControl, Stack, Alert, 
    Snackbar, CircularProgress, IconButton, Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNic } from "../../components/NicContext.jsx";
import { useLanguage } from "../../components/LanguageContext";
import { 
    ChevronLeft, 
    Landscape
} from '@mui/icons-material';

const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#0f172a';       
const BORDER_COLOR = '#cad2c5';    

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

export default function UpdateSoil() {
    const { nic } = useNic();
    const { t } = useLanguage();
    const [farmlandData, setFarmlandData] = useState([]);
    const [selectedFarmland, setSelectedFarmland] = useState('');
    
    // Soil Data States
    const [ph, setPh] = useState('');
    const [temperature, setTemperature] = useState('');
    const [structure, setStructure] = useState('');
    const [waterholding, setWaterholding] = useState('');
    const [nutrition, setNutrition] = useState('');

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const showNotify = (msg, sev) => setNotification({ open: true, message: msg, severity: sev });

    const fetchData = async () => {
        if (!nic) return;
        try {
            // First get farmer's owner context
            const resProfile = await fetch(`http://localhost:8080/farmer/${nic}`);
            if (!resProfile.ok) throw new Error("Could not fetch profile");
            const profile = await resProfile.json();
            const ownerNIC = profile.ownerNIC;

            const res = await fetch(`http://localhost:8080/farmland/getAll/${nic}/${ownerNIC}`);
            if (res.ok) setFarmlandData(await res.json());
        } catch (error) { 
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [nic]);

    const handleSubmit = async () => {
        if (!selectedFarmland || !ph || !temperature) {
            return showNotify(t('fillRequired') || "Please fill essential soil data", "warning");
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/soil/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    farmlandID: selectedFarmland,
                    ph,
                    temperature,
                    structure,
                    waterholding,
                    nutrition
                }),
            });
            if (response.ok) {
                showNotify(t('savedSuccess') || 'Soil parameters updated successfully!', 'success');
                setPh(''); setTemperature(''); setStructure(''); setWaterholding(''); setNutrition('');
            }
        } catch (e) { showNotify(t('error') || 'Update failed', 'error'); }
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', pb: 8, color: SAGE_DARK }}>
            <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small" sx={{ border: `1px solid ${BORDER_COLOR}` }} onClick={() => window.history.back()}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {t('soil') || 'Soil Monitoring'}
                    </Typography>
                </Stack>
            </Box>

            <Container maxWidth="md" sx={{ mt: 6 }} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Box sx={{ mb: 4, textAlign: 'center' }} component={motion.div} variants={itemParams}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>{t('updateSoilTitle') || 'Update Soil Conditions'}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t('soilSubtitle') || 'Log technical soil metrics for your cultivation plots.'}</Typography>
                </Box>

                <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff' }} component={motion.div} variants={itemParams}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth sx={inputStyle}>
                                <InputLabel>{t('selectFarmland') || 'Select Farmland'}</InputLabel>
                                <Select value={selectedFarmland} label={t('selectFarmland') || 'Select Farmland'} onChange={(e) => setSelectedFarmland(e.target.value)}>
                                    {farmlandData.map((f) => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label={t('soilPH') || 'Soil pH'} fullWidth type="number" value={ph} onChange={(e) => setPh(e.target.value)} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label={t('soilTemp') || 'Soil Temp (°C)'} fullWidth type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label={t('soilStructure') || 'Soil Structure'} fullWidth value={structure} onChange={(e) => setStructure(e.target.value)} sx={inputStyle} placeholder="e.g. Sandy, Clayey" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label={t('waterHolding') || 'Water Holding Capacity'} fullWidth value={waterholding} onChange={(e) => setWaterholding(e.target.value)} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label={t('nutritionalLevel') || 'Nutritional Level'} fullWidth value={nutrition} onChange={(e) => setNutrition(e.target.value)} sx={inputStyle} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                fullWidth
                                startIcon={<Landscape />}
                                sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 2, borderRadius: '16px', fontWeight: 700, mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : (t('save') || "Save Soil Data")}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
            </Snackbar>
        </Box>
    );
}
