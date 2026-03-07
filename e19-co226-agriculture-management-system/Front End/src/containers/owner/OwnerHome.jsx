import React, { useState, useEffect } from 'react';
import { 
    Box, Divider, Paper, Typography, Container, Grid, 
    Card, CardContent, Stack, Avatar 
} from '@mui/material';
import FarmlandDetailsCard from "../../components/owner/FarmlandDetailsCard.jsx";

// Icons for a modern dashboard feel
import Landscape from '@mui/icons-material/Landscape';
import Grass from '@mui/icons-material/Grass';
import People from '@mui/icons-material/People';
import Engineering from '@mui/icons-material/Engineering';
import Analytics from '@mui/icons-material/Analytics';
import Terrain from '@mui/icons-material/Terrain';

// --- CropMaster Theme Palette ---
const BG_CREME = '#FDFCF8';        
const SAGE_DARK = '#2C3E35';       
const BORDER_COLOR = '#E5E2D9';    
const ACCENT_GREEN = '#8BA888';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card elevation={0} sx={{ 
        borderRadius: '20px', 
        border: `1px solid ${BORDER_COLOR}`,
        bgcolor: '#fff',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': { 
            transform: 'translateY(-5px)', 
            borderColor: SAGE_DARK,
            boxShadow: '0 12px 20px -10px rgba(44, 62, 53, 0.1)'
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
                    <Typography variant="h4" sx={{ fontWeight: 900, color: SAGE_DARK }}>
                        {value}
                    </Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

const Home = () => {
    const [farmlands, setFarmlands] = useState([]);
    const [farmers, setFarmers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/farmland/getAll')
            .then((res) => res.json())
            .then((data) => setFarmlands(data))
            .catch((err) => console.error('Farmland Fetch Error:', err));

        fetch('http://localhost:8080/farmer/getAll')
            .then((res) => res.json())
            .then((data) => setFarmers(data))
            .catch((err) => console.error('Farmer Fetch Error:', err));
    }, []);

    // Logic for Statistics
    const totalFarmlands = farmlands.length;
    const croppedFarmlands = farmlands.filter((f) => f.cropID !== 0).length;
    const uncroppedFarmlands = totalFarmlands - croppedFarmlands;
    const totalFarmers = farmers.length;
    const experiencedFarmers = farmers.filter((f) => f.experince && f.experince !== '').length;
    const inexperienciedFarmers = totalFarmers - experiencedFarmers;

    return (
        <Box sx={{ bgcolor: BG_CREME, minHeight: '100vh', py: 6, color: SAGE_DARK }}>
            <Container maxWidth="xl">
                
                {/* Dashboard Header */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: ACCENT_GREEN, letterSpacing: 3 }}>
                        Management Overview
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, letterSpacing: '-1px' }}>
                        Owner Dashboard
                    </Typography>
                    <Divider sx={{ width: 80, height: 4, bgcolor: ACCENT_GREEN, mt: 2, borderRadius: 1, border: 'none' }} />
                </Box>

                {/* Statistics Grid */}
                <Grid container spacing={3} sx={{ mb: 8 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Total Farmlands" value={totalFarmlands} icon={Terrain} color="#5D6D7E" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Cultivated Land" value={croppedFarmlands} icon={Grass} color="#4CAF50" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Fallow Land" value={uncroppedFarmlands} icon={Landscape} color="#AAB7B8" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Total Farmers" value={totalFarmers} icon={People} color="#4682B4" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Expert Personnel" value={experiencedFarmers} icon={Engineering} color="#D35400" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard title="Support Staff" value={inexperienciedFarmers} icon={Analytics} color="#7F8C8D" />
                    </Grid>
                </Grid>

                {/* Land Distribution Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Land Distribution Details</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Live monitoring of all registered agricultural assets.</Typography>
                </Box>
                
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: '24px', 
                    border: `1px solid ${BORDER_COLOR}`,
                    bgcolor: '#fff'
                }}>
                    <FarmlandDetailsCard farmlands={farmlands} />
                </Paper>

            </Container>
        </Box>
    );
};

export default Home;