import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Paper, Typography, TextField, Button, 
    FormControl, Select, MenuItem, Stack, Avatar, IconButton, Divider, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import FarmLandCard from '../../components/farmer/FarmLandCard.jsx';
import { useNic } from "../../components/NicContext.jsx";

// Icons
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import GridViewIcon from '@mui/icons-material/GridView';

// --- CropMaster Theme Palette ---
const BG_CREME = '#fffdf2';        
const SAGE_DARK = '#2f3e46';       
const BORDER_COLOR = '#cad2c5';    
const ACCENT_GREEN = '#52796f';
const DARK_MOSS = '#1e293b';

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        bgcolor: '#fff',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
        '&.Mui-focused fieldset': { borderColor: SAGE_DARK },
    }
};

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [loading, setLoading] = useState(true);
    const { nic: ownerNIC } = useNic();

    // Registration Modal State
    const [openModal, setOpenModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notify, setNotify] = useState({ open: false, msg: '', sev: 'success' });
    const [formData, setFormData] = useState({ nic: '', name: '', mobile: '', age: '', password: '', experince: '' });

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const showNotify = (msg, sev = 'success') => setNotify({ open: true, msg, sev });

    useEffect(() => {
        if (!ownerNIC) return;
        const fetchData = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch(`http://localhost:8080/farmer/byOwner/${ownerNIC}`),
                    fetch(`http://localhost:8080/farmland/byOwner/${ownerNIC}`)
                ]);
                setFarmers(await res1.json());
                setFarmlands(await res2.json());
            } catch (error) { 
                console.error("Fetch error:", error); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [ownerNIC]);

    const handleRegister = async () => {
        if (!formData.nic || !formData.name || !formData.password) {
            return showNotify("NIC, Name and Password are required", "warning");
        }
        if (!ownerNIC) return showNotify("Owner session invalid", "error");
        
        setSubmitting(true);
        try {
            const farmerData = { ...formData, ownerNIC };
            const res = await fetch('http://localhost:8080/farmer/addNew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(farmerData)
            });
            if (res.ok) {
                showNotify("Personnel registered successfully!");
                setOpenModal(false);
                setFormData({ nic: '', name: '', mobile: '', age: '', password: '', experince: '' });
                // Refresh list
                const res1 = await fetch(`http://localhost:8080/farmer/byOwner/${ownerNIC}`);
                setFarmers(await res1.json());
            } else {
                showNotify("Registration failed", "error");
            }
        } catch (e) {
            showNotify("Connection error", "error");
        }
        setSubmitting(false);
    };

    const getManagedPlotCount = (nic) => {
        return farmlands.filter(f => f.nic === nic).length;
    };

    const getManagedPlots = (nic) => {
        return farmlands.filter(f => f.nic === nic).map(f => f.name);
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', p: { xs: 2, md: 4 }, color: SAGE_DARK }}>
            
            {/* Header Section */}
            <Stack component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-1px' }}>
                        <PeopleIcon sx={{ fontSize: 40, color: SAGE_DARK }} />
                        PERSONNEL DIRECTORY
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, ml: 7, textTransform: 'uppercase' }}>
                        Owner Access • Registered Farmers
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<PersonAddIcon />}
                    onClick={() => setOpenModal(true)}
                    sx={{ 
                        bgcolor: SAGE_DARK, color: '#fff', borderRadius: '12px', px: 3, fontWeight: 700,
                        '&:hover': { bgcolor: DARK_MOSS }
                    }}
                >
                    Register Personnel
                </Button>
            </Stack>

            <Grid container spacing={4} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid item xs={12}>
                    
                    {/* --- SUMMARY HUB --- */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={4} component={motion.div} variants={itemParams}>
                            <Paper elevation={0} sx={{ 
                                p: 4, height: '100%', borderRadius: '32px', 
                                background: `linear-gradient(135deg, ${SAGE_DARK} 0%, ${DARK_MOSS} 100%)`,
                                color: '#fff'
                            }}>
                                <Typography variant="overline" sx={{ opacity: 0.7, fontWeight: 700 }}>Total Workforce</Typography>
                                <Typography variant="h2" sx={{ fontWeight: 950 }}>{farmers.length}</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Active Registered Personnel</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8} component={motion.div} variants={itemParams}>
                            <Grid container spacing={2} sx={{ height: '100%' }}>
                                <Grid item xs={4}>
                                    <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: `${ACCENT_GREEN}15`, color: ACCENT_GREEN }}><EngineeringIcon /></Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{farmers.filter(f => f.experince).length}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>EXPERTS</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#fdfcf0', color: '#F39C12' }}><PeopleIcon /></Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{farmers.filter(f => !f.experince).length}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>SUPPORT</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: '24px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#f1f5f9', color: SAGE_DARK }}><GridViewIcon /></Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900 }}>{farmlands.length}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>PLOTS</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Farmer List */}
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 4 }}>Registered Personnel</Typography>
                    
                    <Grid container spacing={3}>
                        {(Array.isArray(farmers) ? farmers : []).map((farmer) => (
                            <Grid item xs={12} sm={6} md={4} key={farmer.nic} component={motion.div} variants={itemParams}>
                                <Paper elevation={0} sx={{ 
                                    p: 3, borderRadius: '28px', border: `1px solid ${BORDER_COLOR}`, bgcolor: '#fff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { borderColor: SAGE_DARK, transform: 'translateY(-5px)' }
                                }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                        <Avatar sx={{ bgcolor: SAGE_DARK, width: 50, height: 50 }}>{farmer.name.charAt(0)}</Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{farmer.name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>NIC: {farmer.nic}</Typography>
                                        </Box>
                                        <Chip 
                                            label={farmer.experince ? "EXPERT" : "SUPPORT"} 
                                            size="small" 
                                            sx={{ 
                                                fontWeight: 900, fontSize: '0.6rem',
                                                bgcolor: farmer.experince ? `${ACCENT_GREEN}15` : '#fdfcf0',
                                                color: farmer.experince ? ACCENT_GREEN : '#F39C12',
                                                border: `1px solid ${farmer.experince ? ACCENT_GREEN : '#F39C12'}40`
                                            }}
                                        />
                                    </Stack>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption">Experience</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{farmer.experince || 'N/A'}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption">Mobile</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{farmer.mobile}</Typography>
                                        </Box>
                                        <Box sx={{ mt: 1 }}>
                                            <Chip 
                                                label={`${getManagedPlotCount(farmer.nic)} Managed Plots`} 
                                                size="small" 
                                                sx={{ bgcolor: SAGE_DARK + '15', color: SAGE_DARK, fontWeight: 700, mb: 1 }} 
                                            />
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {getManagedPlots(farmer.nic).map((plotName, idx) => (
                                                    <Chip 
                                                        key={idx}
                                                        label={plotName} 
                                                        size="small" 
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.65rem', height: '20px', borderColor: BORDER_COLOR, color: ACCENT_GREEN }} 
                                                    />
                                                ))}
                                                {getManagedPlotCount(farmer.nic) === 0 && (
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                        No plots assigned
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Registration Modal */}
            <Dialog 
                open={openModal} 
                onClose={() => !submitting && setOpenModal(false)}
                PaperProps={{ sx: { borderRadius: '24px', p: 1, maxWidth: '450px', width: '100%' } }}
            >
                <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Registration Portal
                    <IconButton onClick={() => setOpenModal(false)} disabled={submitting}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Enter personnel details to authorize a new staff member. If experience is left blank, they will be tagged as Support Staff.
                    </Typography>
                    <Stack spacing={2}>
                        <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleFormChange} sx={inputStyle} />
                        <TextField fullWidth label="NIC Number" name="nic" value={formData.nic} onChange={handleFormChange} sx={inputStyle} />
                        <TextField fullWidth label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleFormChange} sx={inputStyle} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleFormChange} sx={inputStyle} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Experience" name="experince" value={formData.experince} onChange={handleFormChange} sx={inputStyle} />
                            </Grid>
                        </Grid>
                        <TextField fullWidth label="System Password" name="password" type="password" value={formData.password} onChange={handleFormChange} sx={inputStyle} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleRegister} 
                        disabled={submitting}
                        sx={{ bgcolor: SAGE_DARK, color: '#fff', py: 1.5, borderRadius: '12px', fontWeight: 700 }}
                    >
                        {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Finalize Registration"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({ ...notify, open: false })}>
                <Alert severity={notify.sev} variant="filled" sx={{ width: '100%' }}>{notify.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageFarmers;