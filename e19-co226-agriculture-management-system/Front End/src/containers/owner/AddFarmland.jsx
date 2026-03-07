import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TextField, Button, Box, MenuItem, 
    Select, Paper, InputLabel, FormControl, Grid, Stack, Divider
} from '@mui/material';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

// --- CropMaster Theme Palette ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const BORDER_COLOR = '#E5E2D9';    
const ACCENT_GREEN = '#8BA888';

const formCardStyle = {
    p: 4, 
    borderRadius: '24px', 
    border: `1px solid ${BORDER_COLOR}`, 
    bgcolor: '#fff',
    height: '100%'
};

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '& fieldset': { borderColor: BORDER_COLOR },
        '&:hover fieldset': { borderColor: SAGE_DARK },
        '&.Mui-focused fieldset': { borderColor: SAGE_DARK },
    }
};

const AddFarmland = () => {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [location, setLocation] = useState('');

    const [farmers, setFarmers] = useState([]);
    const [farmlands, setFarmlands] = useState([]);
    const [nicFarmlands, setNicFarmlands] = useState([]);
    
    const [selectedFarmer, setSelectedFarmer] = useState('');
    const [selectedFarmland, setSelectedFarmland] = useState('');
    const [selectedAssignFarmer, setSelectedAssignFarmer] = useState('');
    const [selectedAssignFarmland, setSelectedAssignFarmland] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/farmer/getAll').then(res => res.json()).then(data => setFarmers(data));
        fetch('http://localhost:8080/farmland/noNic').then(res => res.json()).then(data => setFarmlands(data));
        fetch('http://localhost:8080/farmland/nic').then(res => res.json()).then(data => setNicFarmlands(data));
    }, []);

    const handleAddFarmland = () => {
        const newFarmland = { name, size, location };
        fetch('http://localhost:8080/farmland/addNew', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFarmland),
        }).then(() => window.location.reload());
    };

    const handleAssignFarmer = () => {
        if (selectedFarmer && selectedFarmland) {
            fetch(`http://localhost:8080/farmland/updateFarmer/${selectedFarmland}/${selectedFarmer}`, { method: 'PUT' })
                .then(() => window.location.reload());
        }
    };

    const handleUpdateAssignFarmer = () => {
        if (selectedAssignFarmland && selectedAssignFarmer) {
            fetch(`http://localhost:8080/farmland/updateFarmer/${selectedAssignFarmland}/${selectedAssignFarmer}`, { method: 'PUT' })
                .then(() => window.location.reload());
        }
    };

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', py: 6, color: SAGE_DARK }}>
            <Container maxWidth="lg">
                
                {/* Header Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: ACCENT_GREEN, letterSpacing: 2 }}>
                        Asset Management
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                        Land & Resource Registry
                    </Typography>
                    <Divider sx={{ width: 60, height: 4, bgcolor: ACCENT_GREEN, mx: 'auto', mt: 2, borderRadius: 1, border: 'none' }} />
                </Box>

                <Grid container spacing={4}>
                    
                    {/* 1. Add New Farmland */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={formCardStyle}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <LandscapeIcon sx={{ color: ACCENT_GREEN }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Register Land</Typography>
                            </Stack>
                            <Stack spacing={2.5}>
                                <TextField label="Property Name" fullWidth sx={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                                <TextField label="Acreage / Size" fullWidth sx={inputStyle} value={size} onChange={(e) => setSize(e.target.value)} />
                                <TextField label="Geographic Location" fullWidth sx={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} />
                                <Button variant="contained" fullWidth onClick={handleAddFarmland} sx={{ bgcolor: SAGE_DARK, py: 1.5, borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#1a2621' } }}>
                                    Confirm Registration
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* 2. Assign Farmer (Initial) */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={formCardStyle}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <PersonAddIcon sx={{ color: ACCENT_GREEN }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Primary Assignment</Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                Assign an available farmer to a newly registered, unmanaged plot.
                            </Typography>
                            <Stack spacing={2.5}>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Operator</InputLabel>
                                    <Select label="Select Operator" value={selectedFarmer} onChange={(e) => setSelectedFarmer(e.target.value)}>
                                        {farmers.map(f => <MenuItem key={f.nic} value={f.nic}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={inputStyle}>
                                    <InputLabel>Select Plot</InputLabel>
                                    <Select label="Select Plot" value={selectedFarmland} onChange={(e) => setSelectedFarmland(e.target.value)}>
                                        {farmlands.map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" fullWidth onClick={handleAssignFarmer} sx={{ borderColor: SAGE_DARK, color: SAGE_DARK, py: 1.5, borderRadius: '12px', fontWeight: 800, border: '2px solid' }}>
                                    Deploy Personnel
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* 3. Change Assignment (Re-assignment) */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ ...formCardStyle, bgcolor: '#F4F7F5' }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <SyncAltIcon sx={{ color: SAGE_DARK }} />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Re-assignment Hub</Typography>
                            </Stack>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth sx={inputStyle}>
                                        <InputLabel>New Operator</InputLabel>
                                        <Select label="New Operator" value={selectedAssignFarmer} onChange={(e) => setSelectedAssignFarmer(e.target.value)}>
                                            {farmers.map(f => <MenuItem key={f.nic} value={f.nic}>{f.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth sx={inputStyle}>
                                        <InputLabel>Current Managed Land</InputLabel>
                                        <Select label="Current Managed Land" value={selectedAssignFarmland} onChange={(e) => setSelectedAssignFarmland(e.target.value)}>
                                            {nicFarmlands.map(f => <MenuItem key={f.farmlandID} value={f.farmlandID}>{f.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button variant="contained" fullWidth onClick={handleUpdateAssignFarmer} sx={{ bgcolor: ACCENT_GREEN, color: '#fff', py: 2, borderRadius: '12px', fontWeight: 700, '&:hover': { bgcolor: '#6d8a6b' } }}>
                                        Transfer Management
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};

export default AddFarmland;