import * as React from 'react';
import {
    Box, Card, CardActions, CardContent, Button, Typography,
    Dialog, DialogContent, DialogTitle, Divider, Stack, IconButton, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function FarmLandCard({
    farmlandID,
    name,
    size,
    location,
    isCropped,
    displayIndex,
}) {
    const theme = useTheme();

    const [plantDetails, setPlantDetails] = React.useState(null);
    const [soilDetails, setSoilDetails] = React.useState(null);
    const [weatherDetails, setWeatherDetails] = React.useState(null);

    const [openPlantDialog, setOpenPlantDialog] = React.useState(false);
    const [openSoilDialog, setOpenSoilDialog] = React.useState(false);
    const [openWeatherDialog, setOpenWeatherDialog] = React.useState(false);
    const [openDiseaseDialog, setOpenDiseaseDialog] = React.useState(false);
    const [diseaseData, setDiseaseData] = React.useState([]);

    const [openChemicalDialog, setOpenChemicalDialog] = React.useState(false);
    const [chemicalData, setChemicalData] = React.useState([]);

    const [openMachineryDialog, setOpenMachineryDialog] = React.useState(false);
    const [machineryData, setMachineryData] = React.useState([]);

    React.useEffect(() => {
        if (isCropped) {
            fetch(`http://localhost:8080/soil/getDetails/${farmlandID}`)
                .then((res) => res.json())
                .then(setSoilDetails)
                .catch(console.error);
            
            fetch(`http://localhost:8080/weather/getDetails/${farmlandID}`)
                .then((res) => res.json())
                .then(setWeatherDetails)
                .catch(console.error);
        }
    }, [farmlandID, isCropped]);

    const handleViewPlantClick = async () => {
        try {
            const response = await fetch(`http://localhost:8080/farmland/getCrop/${farmlandID}`);
            const cropID = await response.text();
            const plantResponse = await fetch(`http://localhost:8080/crop/getbyID/${cropID}`);
            const plantData = await plantResponse.json();
            setPlantDetails(plantData);
            setOpenPlantDialog(true);
        } catch (error) {
            console.error('Error fetching plant details:', error);
        }
    };

    const handleViewSoilClick = () => {
        fetch(`http://localhost:8080/soil/getDetails/${farmlandID}`)
            .then((res) => res.json())
            .then((data) => { setSoilDetails(data); setOpenSoilDialog(true); })
            .catch((err) => console.error(err));
    };

    const handleViewWeatherClick = () => {
        fetch(`http://localhost:8080/weather/getDetails/${farmlandID}`)
            .then((res) => res.json())
            .then((data) => { setWeatherDetails(data); setOpenWeatherDialog(true); })
            .catch((err) => console.error(err));
    };

    const handleViewDiseaseClick = () => {
        fetch(`http://localhost:8080/hostcrop/getDisease/${farmlandID}`)
            .then((res) => res.json())
            .then((data) => { setDiseaseData(data); setOpenDiseaseDialog(true); })
            .catch((err) => console.error(err));
    };

    const handleViewChemicalClick = () => {
        fetch(`http://localhost:8080/chemicalusage/getChemical/${farmlandID}`)
            .then((res) => res.json())
            .then((data) => { setChemicalData(data); setOpenChemicalDialog(true); })
            .catch((err) => console.error(err));
    };

    const handleViewMachineryClick = () => {
        fetch(`http://localhost:8080/machineryusage/getMachinery/${farmlandID}`)
            .then((res) => res.json())
            .then((data) => { setMachineryData(data); setOpenMachineryDialog(true); })
            .catch((err) => console.error(err));
    };

    // Dialog Header Component
    const ModernDialogTitle = ({ title, onClose }) => (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{title}</Typography>
            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
    );

    // Dialog Item Row
    const DetailRow = ({ label, value }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
        </Box>
    );

    const TrendItem = ({ label, value, unit = "" }) => (
        <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>{label}</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{value}<span style={{ fontSize: '10px' }}>{unit}</span></Typography>
        </Box>
    );

    return (
        <Box>
            <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'transparent' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', bgcolor: 'primary.light', px: 1.5, py: 0.5, borderRadius: 1, color: '#fff' }}>
                            ID: {displayIndex != null ? displayIndex : farmlandID}
                        </Typography>
                        {isCropped && (
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main', bgcolor: 'success.light', px: 1.5, py: 0.5, borderRadius: 1, color: '#fff' }}>
                                Cultivated
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{name}</Typography>
                    
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        <DetailRow label="Size" value={size} />
                        <DetailRow label="Location" value={location} />
                    </Stack>

                    {isCropped && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Status</Typography>
                            <Stack direction="row" spacing={1}>
                                <TrendItem label="Temp" value={weatherDetails?.temperature || '--'} unit="°C" />
                                <TrendItem label="Soil pH" value={soilDetails?.ph || '--'} />
                                <TrendItem label="Humidity" value={weatherDetails?.humidity || '--'} unit="%" />
                            </Stack>
                        </Box>
                    )}
                </CardContent>
                
                <CardActions sx={{ px: 3, pb: 3, pt: 0, flexWrap: 'wrap', gap: 1 }}>
                    <Button size="small" variant="outlined" color="secondary" onClick={handleViewSoilClick} sx={{ borderRadius: 2 }}>Soil</Button>
                    <Button size="small" variant="outlined" color="info" onClick={handleViewWeatherClick} sx={{ borderRadius: 2 }}>Weather</Button>
                    <Button size="small" variant="outlined" color="error" onClick={handleViewDiseaseClick} sx={{ borderRadius: 2 }}>Diseases</Button>
                    <Button size="small" variant="outlined" color="warning" onClick={handleViewChemicalClick} sx={{ borderRadius: 2 }}>Chemicals</Button>
                    <Button size="small" variant="outlined" color="neutral" onClick={handleViewMachineryClick} sx={{ borderRadius: 2 }}>Machinery</Button>
                    {isCropped && (
                        <Button size="small" variant="contained" color="primary" onClick={handleViewPlantClick} sx={{ borderRadius: 2 }}>Crop Data</Button>
                    )}
                </CardActions>
            </Card>

            {/* Dialogs */}
            <Dialog open={openPlantDialog} onClose={() => setOpenPlantDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Crop Details" onClose={() => setOpenPlantDialog(false)} />
                <DialogContent dividers>
                    {plantDetails ? (
                        <Stack spacing={0}>
                            <DetailRow label="Name" value={plantDetails.name} />
                            <DetailRow label="Variety" value={plantDetails.variety} />
                        </Stack>
                    ) : <Typography align="center" color="text.secondary" py={4}>No data available</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openSoilDialog} onClose={() => setOpenSoilDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Soil Conditions" onClose={() => setOpenSoilDialog(false)} />
                <DialogContent dividers>
                    {soilDetails ? (
                        <Stack spacing={0}>
                            <DetailRow label="Temperature" value={soilDetails.temperature} />
                            <DetailRow label="pH Level" value={soilDetails.ph} />
                            <DetailRow label="Structure" value={soilDetails.structure} />
                            <DetailRow label="Water Holding" value={soilDetails.waterholding} />
                            <DetailRow label="Nutrition" value={soilDetails.nutrition} />
                        </Stack>
                    ) : <Typography align="center" color="text.secondary" py={4}>No data available</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openWeatherDialog} onClose={() => setOpenWeatherDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Weather Data" onClose={() => setOpenWeatherDialog(false)} />
                <DialogContent dividers>
                    {weatherDetails ? (
                        <Stack spacing={0}>
                            <DetailRow label="Temperature" value={weatherDetails.temperature} />
                            <DetailRow label="Rainfall" value={weatherDetails.rainfall} />
                            <DetailRow label="Humidity" value={weatherDetails.humidity} />
                            <DetailRow label="Wind Speed" value={weatherDetails.windspeed} />
                            <DetailRow label="Radiation" value={weatherDetails.radiation} />
                        </Stack>
                    ) : <Typography align="center" color="text.secondary" py={4}>No data available</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openDiseaseDialog} onClose={() => setOpenDiseaseDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Reported Diseases" onClose={() => setOpenDiseaseDialog(false)} />
                <DialogContent dividers>
                    {diseaseData?.length > 0 ? diseaseData.map((d, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <DetailRow label="Disease" value={d.diseaseName} />
                            <DetailRow label="Reporter NIC" value={d.nic} />
                            <DetailRow label="Date" value={d.date} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No diseases reported</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openChemicalDialog} onClose={() => setOpenChemicalDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Chemical Usage" onClose={() => setOpenChemicalDialog(false)} />
                <DialogContent dividers>
                    {chemicalData?.length > 0 ? chemicalData.map((c, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <DetailRow label="Chemical" value={c.chemicalName} />
                            <DetailRow label="User NIC" value={c.nic} />
                            <DetailRow label="Date" value={c.date} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No chemicals used</Typography>}
                </DialogContent>
            </Dialog>

            <Dialog open={openMachineryDialog} onClose={() => setOpenMachineryDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <ModernDialogTitle title="Machinery Usage" onClose={() => setOpenMachineryDialog(false)} />
                <DialogContent dividers>
                    {machineryData?.length > 0 ? machineryData.map((m, i) => (
                        <Box key={i} sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <DetailRow label="Machinery" value={m.machineryName} />
                            <DetailRow label="User NIC" value={m.nic} />
                            <DetailRow label="Date" value={m.date} />
                        </Box>
                    )) : <Typography align="center" color="text.secondary" py={4}>No machinery used</Typography>}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default FarmLandCard;