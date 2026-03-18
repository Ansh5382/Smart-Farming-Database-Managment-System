import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    Speed,
    CheckCircle,
    Warning,
    Score,
    TrendingUp
} from '@mui/icons-material';

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const SoilHealth = () => {
    const [soilData, setSoilData] = useState({
        ph: 7.0,
        nitrogen: 50,
        phosphorus: 50,
        potassium: 50
    });
    const [healthScore, setHealthScore] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    const calculateHealthScore = () => {
        let score = 0;
        let newRecommendations = [];

        // pH Score (0-25 points)
        const ph = soilData.ph;
        let phScore = 0;
        if (ph >= 6.0 && ph <= 7.0) {
            phScore = 25;
        } else if (ph >= 5.5 && ph < 6.0) {
            phScore = 20;
        } else if (ph > 7.0 && ph <= 7.5) {
            phScore = 20;
        } else if (ph >= 5.0 && ph < 5.5) {
            phScore = 10;
        } else if (ph > 7.5 && ph <= 8.0) {
            phScore = 10;
        } else {
            phScore = 5;
        }
        score += phScore;

        if (ph < 6.0) {
            newRecommendations.push({ type: 'warning', text: 'pH is too low. Consider adding lime to raise pH.' });
        } else if (ph > 7.0) {
            newRecommendations.push({ type: 'warning', text: 'pH is too high. Consider adding sulfur to lower pH.' });
        } else {
            newRecommendations.push({ type: 'success', text: 'pH level is optimal for most crops!' });
        }

        // Nitrogen Score (0-25 points)
        const nitrogen = soilData.nitrogen;
        let nitrogenScore = 0;
        if (nitrogen >= 40 && nitrogen <= 60) {
            nitrogenScore = 25;
        } else if ((nitrogen >= 30 && nitrogen < 40) || (nitrogen > 60 && nitrogen <= 80)) {
            nitrogenScore = 20;
        } else if ((nitrogen >= 20 && nitrogen < 30) || (nitrogen > 80 && nitrogen <= 100)) {
            nitrogenScore = 10;
        } else {
            nitrogenScore = 5;
        }
        score += nitrogenScore;

        if (nitrogen < 40) {
            newRecommendations.push({ type: 'warning', text: 'Nitrogen is low. Add nitrogen-rich fertilizers.' });
        } else if (nitrogen > 60) {
            newRecommendations.push({ type: 'warning', text: 'Nitrogen is high. Reduce nitrogen fertilization.' });
        } else {
            newRecommendations.push({ type: 'success', text: 'Nitrogen level is optimal!' });
        }

        // Phosphorus Score (0-25 points)
        const phosphorus = soilData.phosphorus;
        let phosphorusScore = 0;
        if (phosphorus >= 40 && phosphorus <= 60) {
            phosphorusScore = 25;
        } else if ((phosphorus >= 30 && phosphorus < 40) || (phosphorus > 60 && phosphorus <= 80)) {
            phosphorusScore = 20;
        } else if ((phosphorus >= 20 && phosphorus < 30) || (phosphorus > 80 && phosphorus <= 100)) {
            phosphorusScore = 10;
        } else {
            phosphorusScore = 5;
        }
        score += phosphorusScore;

        if (phosphorus < 40) {
            newRecommendations.push({ type: 'warning', text: 'Phosphorus is low. Add phosphate fertilizers.' });
        } else if (phosphorus > 60) {
            newRecommendations.push({ type: 'warning', text: 'Phosphorus is high. Reduce phosphate application.' });
        } else {
            newRecommendations.push({ type: 'success', text: 'Phosphorus level is optimal!' });
        }

        // Potassium Score (0-25 points)
        const potassium = soilData.potassium;
        let potassiumScore = 0;
        if (potassium >= 40 && potassium <= 60) {
            potassiumScore = 25;
        } else if ((potassium >= 30 && potassium < 40) || (potassium > 60 && potassium <= 80)) {
            potassiumScore = 20;
        } else if ((potassium >= 20 && potassium < 30) || (potassium > 80 && potassium <= 100)) {
            potassiumScore = 10;
        } else {
            potassiumScore = 5;
        }
        score += potassiumScore;

        if (potassium < 40) {
            newRecommendations.push({ type: 'warning', text: 'Potassium is low. Add potash fertilizers.' });
        } else if (potassium > 60) {
            newRecommendations.push({ type: 'warning', text: 'Potassium is high. Reduce potassium application.' });
        } else {
            newRecommendations.push({ type: 'success', text: 'Potassium level is optimal!' });
        }

        setHealthScore(score);
        setRecommendations(newRecommendations);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box component={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Soil Health Analysis
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Enter your soil test results to calculate soil health score and get recommendations.
                </Typography>
            </Box>

            <Grid container spacing={3} component={motion.div} variants={containerParams} initial="hidden" animate="show">
                <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Speed color="primary" /> Soil Parameters
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Soil pH (0-14)</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={soilData.ph}
                                onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) || 0 })}
                                inputProps={{ min: 0, max: 14, step: 0.1 }}
                                placeholder="Enter pH value (e.g., 6.5)"
                            />
                            <Typography variant="caption" color="text.secondary">Optimal: 6.0 - 7.0</Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Nitrogen (ppm)</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={soilData.nitrogen}
                                onChange={(e) => setSoilData({ ...soilData, nitrogen: parseInt(e.target.value) || 0 })}
                                inputProps={{ min: 0, max: 100 }}
                                placeholder="Enter nitrogen level"
                            />
                            <Typography variant="caption" color="text.secondary">Optimal: 40-60 ppm</Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Phosphorus (ppm)</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={soilData.phosphorus}
                                onChange={(e) => setSoilData({ ...soilData, phosphorus: parseInt(e.target.value) || 0 })}
                                inputProps={{ min: 0, max: 100 }}
                                placeholder="Enter phosphorus level"
                            />
                            <Typography variant="caption" color="text.secondary">Optimal: 40-60 ppm</Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography gutterBottom>Potassium (ppm)</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={soilData.potassium}
                                onChange={(e) => setSoilData({ ...soilData, potassium: parseInt(e.target.value) || 0 })}
                                inputProps={{ min: 0, max: 100 }}
                                placeholder="Enter potassium level"
                            />
                            <Typography variant="caption" color="text.secondary">Optimal: 40-60 ppm</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={calculateHealthScore}
                            startIcon={<Score />}
                            sx={{ mt: 1 }}
                        >
                            Calculate Health Score
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} component={motion.div} variants={itemParams}>
                    {healthScore !== null ? (
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="h6" gutterBottom>Soil Health Score</Typography>
                                <Box sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    bgcolor: getScoreColor(healthScore),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    boxShadow: `0 0 30px ${getScoreColor(healthScore)}40`
                                }}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                                        {healthScore}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={getScoreLabel(healthScore)} 
                                    sx={{ mt: 2, bgcolor: getScoreColor(healthScore), color: 'white' }}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                Recommendations
                            </Typography>
                            <List>
                                {recommendations.map((rec, index) => (
                                    <ListItem key={index} sx={{ px: 0 }} component={motion.li} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                                        <ListItemIcon>
                                            {rec.type === 'success' ? (
                                                <CheckCircle sx={{ color: '#22c55e' }} />
                                            ) : (
                                                <Warning sx={{ color: '#f59e0b' }} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={rec.text} />
                                    </ListItem>
                                ))}
                            </List>
                            
                            <Box sx={{ mt: 3 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TrendingUp color="primary" />
                                    <Typography variant="body2" color="text.secondary">
                                        Health Score Progress
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={healthScore} 
                                    sx={{ 
                                        height: 10, 
                                        borderRadius: 5,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 5,
                                            bgcolor: getScoreColor(healthScore)
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    ) : (
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', py: 8 }}>
                            <Score sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Enter soil parameters and click calculate to see results
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SoilHealth;
