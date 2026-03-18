import React, { useState } from 'react';
import { 
    Box, Button, Typography, Dialog, DialogTitle, DialogContent, 
    Stack, IconButton, useTheme, Grid, Paper, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpacityIcon from '@mui/icons-material/Opacity';
import LandscapeIcon from '@mui/icons-material/Landscape';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ScienceIcon from '@mui/icons-material/Science';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const FarmlandDetailsCard = ({ 
    farmlands, 
    selectedFarmland, 
    setSelectedFarmland,
    weatherData,
    soilData,
    diseaseData,
    chemicalData,
    machineData
}) => {
    const theme = useTheme();
    
    // Dialog states
    const [openDialog, setOpenDialog] = useState(null); // 'weather', 'soil', 'disease', 'chemical', 'machine'

    const ModernDialogTitle = ({ title }) => (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
            <IconButton onClick={() => setOpenDialog(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
    );

    const DetailRow = ({ label, value }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
        </Box>
    );

    return (
        <Box>
            {selectedFarmland && (
                <Paper sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: `${theme.palette.primary.main}10`, border: `1px solid ${theme.palette.primary.main}40` }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Selected Asset
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: 'text.primary' }}>
                                {selectedFarmland.name}
                            </Typography>
                        </Box>
                        
                        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="flex-end">
                            <Button variant="contained" color="info" startIcon={<OpacityIcon />} onClick={() => setOpenDialog('weather')} sx={{ borderRadius: 2 }}>Weather</Button>
                            <Button variant="contained" color="success" startIcon={<LandscapeIcon />} onClick={() => setOpenDialog('soil')} sx={{ borderRadius: 2 }}>Soil</Button>
                            <Button variant="contained" color="error" startIcon={<CoronavirusIcon />} onClick={() => setOpenDialog('disease')} sx={{ borderRadius: 2 }}>Diseases</Button>
                            <Button variant="contained" color="warning" startIcon={<ScienceIcon />} onClick={() => setOpenDialog('chemical')} sx={{ borderRadius: 2 }}>Chemicals</Button>
                            <Button variant="contained" color="secondary" startIcon={<PrecisionManufacturingIcon />} onClick={() => setOpenDialog('machine')} sx={{ borderRadius: 2 }}>Machinery</Button>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            <Grid container spacing={3}>
                {(Array.isArray(farmlands) ? farmlands : []).map((farmland, index) => (
                    <Grid item xs={12} sm={6} md={4} key={farmland.farmlandID}>
                        <Paper sx={{ 
                            p: 3, 
                            borderRadius: '20px', 
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            bgcolor: selectedFarmland?.farmlandID === farmland.farmlandID ? `${theme.palette.primary.main}05` : 'background.paper',
                            borderColor: selectedFarmland?.farmlandID === farmland.farmlandID ? 'primary.main' : 'divider',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)'
                            }
                        }} onClick={() => setSelectedFarmland(farmland)}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Chip label={`ID: ${index + 1}`} size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{farmland.name}</Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}><strong>Size:</strong> {farmland.size}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}><strong>Location:</strong> {farmland.location}</Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Dialogs */}
            <Dialog open={openDialog === 'weather'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title={`Weather Data: ${selectedFarmland?.name}`} />
                <DialogContent>
                    {weatherData ? (
                        <Stack spacing={0} sx={{ mt: 1 }}>
                            <DetailRow label="Temperature" value={weatherData.temperature} />
                            <DetailRow label="Humidity" value={weatherData.humidity} />
                            <DetailRow label="Wind Speed" value={weatherData.windspeed} />
                            <DetailRow label="Rainfall" value={weatherData.rainfall} />
                            <DetailRow label="Radiation" value={weatherData.radiation} />
                        </Stack>
                    ) : <Typography align="center" color="text.secondary" py={4}>No data available</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog === 'soil'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title={`Soil Conditions: ${selectedFarmland?.name}`} />
                <DialogContent>
                    {soilData ? (
                        <Stack spacing={0} sx={{ mt: 1 }}>
                            <DetailRow label="Temperature" value={soilData.temperature} />
                            <DetailRow label="pH Level" value={soilData.ph} />
                            <DetailRow label="Structure" value={soilData.structure} />
                            <DetailRow label="Water Holding" value={soilData.waterholding} />
                            <DetailRow label="Nutrition" value={soilData.nutrition} />
                        </Stack>
                    ) : <Typography align="center" color="text.secondary" py={4}>No data available</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog === 'disease'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title={`Reported Diseases: ${selectedFarmland?.name}`} />
                <DialogContent>
                    {diseaseData?.length > 0 ? diseaseData.map((d, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, mt: 1 }}>
                            <DetailRow label="Disease" value={d.diseaseName} />
                            <DetailRow label="Reporter NIC" value={d.nic} />
                            <DetailRow label="Date" value={new Date(d.date).toLocaleDateString()} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No diseases reported</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog === 'chemical'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title={`Chemical Usage: ${selectedFarmland?.name}`} />
                <DialogContent>
                    {chemicalData?.length > 0 ? chemicalData.map((c, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, mt: 1 }}>
                            <DetailRow label="Chemical" value={c.chemicalName} />
                            <DetailRow label="User NIC" value={c.nic} />
                            <DetailRow label="Date" value={new Date(c.date).toLocaleDateString()} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No chemicals used</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog === 'machine'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title={`Machinery Usage: ${selectedFarmland?.name}`} />
                <DialogContent>
                    {machineData?.length > 0 ? machineData.map((m, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, mt: 1 }}>
                            <DetailRow label="Machinery" value={m.machineryName} />
                            <DetailRow label="User NIC" value={m.nic} />
                            <DetailRow label="Date" value={new Date(m.date).toLocaleDateString()} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No machinery used</Typography>}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default FarmlandDetailsCard;
