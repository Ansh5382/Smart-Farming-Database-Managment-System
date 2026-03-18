import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Box,
    Avatar,
    Stack,
    Divider,
    IconButton,
    Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import TerrainIcon from '@mui/icons-material/Terrain';

const FarmerCard = ({ farmer }) => {
    const [open, setOpen] = useState(false);
    const [farmlands, setFarmlands] = useState([]);
    const theme = useTheme();

    const { nic: ownerNIC } = useNic();

    const handleOpenModal = () => {
        if (!ownerNIC) return;
        // Fetch farmland data for the farmer from API (Context-aware)
        fetch(`http://localhost:8080/farmland/getAll/${farmer.nic}/${ownerNIC}`)
            .then(response => response.json())
            .then(data => setFarmlands(data))
            .catch(error => console.error('Error fetching farmlands:', error));

        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    return (
        <Card 
            component={motion.div}
            whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.2)' }}
            sx={{ 
                mb: 3, 
                borderRadius: '24px', 
                border: '1px solid', 
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                '&:hover': {
                    borderColor: 'primary.main'
                }
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ bgcolor: `${theme.palette.primary.main}15`, color: 'primary.main', width: 64, height: 64 }}>
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                            {farmer.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            NIC: {farmer.nic}
                        </Typography>
                    </Box>
                </Stack>
                
                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>AGE</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{farmer.age} Years</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>MOBILE</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{farmer.mobile || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>EXPERIENCE</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{farmer.experince || 'N/A'} Years</Typography>
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    onClick={handleOpenModal}
                    fullWidth
                    sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 700,
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' }
                    }}
                >
                    VIEW FARMLANDS
                </Button>
            </CardContent>

            <FarmerDetailsModal open={open} onClose={handleCloseModal} farmer={farmer} farmlands={farmlands} />
        </Card>
    );
};

const FarmerDetailsModal = ({ open, onClose, farmer, farmlands }) => {
    const theme = useTheme();

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: '24px',
                    p: 2,
                    boxShadow: '0 24px 48px -12px rgba(0,0,0,0.2)'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{farmer.name}'s Assets</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Farmland Directory</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ bgcolor: 'background.default' }}><CloseIcon /></IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
                {farmlands.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <TerrainIcon sx={{ fontSize: 60, color: 'divider', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>No Farmlands Assigned</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {farmlands.map((farmland, index) => (
                            <Box key={farmland.farmlandID}>
                                <ListItem sx={{ p: 3, bgcolor: `${theme.palette.primary.main}05`, borderRadius: '16px', mb: 2, border: '1px solid', borderColor: `${theme.palette.primary.main}20` }}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                                                {farmland.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <strong style={{ color: theme.palette.text.primary }}>Size:</strong> {farmland.size}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    <strong style={{ color: theme.palette.text.primary }}>Location:</strong> {farmland.location}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                )}
            </DialogContent>
            
            <DialogActions sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '12px', fontWeight: 700, px: 4 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FarmerCard;
