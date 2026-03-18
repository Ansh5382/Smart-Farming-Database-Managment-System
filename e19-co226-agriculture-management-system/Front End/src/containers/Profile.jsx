import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Paper, Avatar, TextField,
    Button, Stack, Divider, Alert, Snackbar, IconButton, Chip, CircularProgress
} from '@mui/material';
import {
    PersonOutline, EditOutlined, SaveOutlined, CloseOutlined,
    BadgeOutlined, PhoneOutlined, CakeOutlined, WorkOutline
} from '@mui/icons-material';
import { useNic } from '../components/NicContext.jsx';
import { motion } from 'framer-motion';

// --- Animations ---
const containerParams = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemParams = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const headerParams = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// InfoRow component moved outside to prevent re-renders
const InfoRow = ({ icon, label, value, field, editing, editData, onChange, accentColor }) => {
    const editValue = editData[field] !== undefined && editData[field] !== null ? editData[field] : '';
    const displayValue = value !== undefined && value !== null && value !== '' && value !== 0 ? value : 'Not set';

    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ color: accentColor, display: 'flex' }}>{icon}</Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                    {label}
                </Typography>
                {editing && field ? (
                    <TextField
                        fullWidth
                        variant="standard"
                        type={field === 'age' ? 'number' : 'text'}
                        value={editValue}
                        onChange={(e) => onChange(field, e.target.value)}
                        sx={{ mt: 0.5 }}
                    />
                ) : (
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {displayValue}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
};

const Profile = ({ role }) => {
    const { nic } = useNic();
    const isOwner = role === 'owner';
    const accentColor = '#52796f';

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch profile
    useEffect(() => {
        if (!nic) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:8080/${role}/${nic}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setEditData(data);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [nic, role]);

    const handleEdit = useCallback(() => {
        setEditData({ ...profile });
        setEditing(true);
    }, [profile]);

    const handleCancel = useCallback(() => {
        setEditData({ ...profile });
        setEditing(false);
    }, [profile]);

    const handleChange = useCallback((field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...editData };
            
            if (payload.age !== undefined && payload.age !== null && payload.age !== '') {
                const parsedAge = parseInt(payload.age);
                if (!isNaN(parsedAge) && parsedAge > 0) {
                    payload.age = parsedAge;
                } else {
                    payload.age = profile.age;
                }
            }
            
            if (!payload.name) payload.name = '';
            if (!payload.mobile) payload.mobile = '';
            if (!isOwner && !payload.experince) payload.experince = '';

            const res = await fetch(`http://localhost:8080/${role}/updateProfile/${nic}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const updated = await res.json();
                setProfile(updated);
                setEditData(updated);
                setEditing(false);
                setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
            }
        } catch (err) {
            setSnackbar({ open: true, message: 'Connection error.', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: accentColor }} />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error">Could not load profile data. Please make sure you are logged in.</Alert>
            </Container>
        );
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{ py: 6 }}
            component={motion.div}
            variants={containerParams}
            initial="hidden"
            animate="show"
        >
            {/* Header Card */}
            <motion.div variants={headerParams}>
                <Paper elevation={0} sx={{
                    p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider',
                    mb: 3, background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #1a2a36 0%, #162029 100%)'
                        : 'linear-gradient(135deg, #f0f4f0 0%, #fffdf2 100%)'
                }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
                        <Avatar sx={{
                            width: 90, height: 90,
                            bgcolor: accentColor,
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            boxShadow: '0 8px 24px rgba(82, 121, 111, 0.2)',
                            border: '3px solid #fff'
                        }}>
                            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                        </Avatar>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'text.primary' }}>
                                {profile.name || 'Unknown'}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                <Chip label={isOwner ? 'Owner' : 'Farmer'} size="small" sx={{ fontWeight: 700, bgcolor: `${accentColor}15`, color: accentColor }} />
                                <Chip label={`NIC: ${profile.nic}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                            </Stack>
                        </Box>
                        <Box sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                            {editing ? (
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveOutlined />}
                                        onClick={handleSave}
                                        disabled={saving}
                                        sx={{ borderRadius: 2, fontWeight: 700 }}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <IconButton onClick={handleCancel} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                        <CloseOutlined />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Button
                                    variant="outlined"
                                    startIcon={<EditOutlined />}
                                    onClick={handleEdit}
                                    sx={{ borderRadius: 2, fontWeight: 700, borderColor: accentColor, color: accentColor }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </motion.div>

            {/* Details Card */}
            <motion.div variants={itemParams}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: accentColor }}>
                        <PersonOutline /> Personal Information
                    </Typography>

                    <InfoRow icon={<BadgeOutlined />} label="Full Name" value={profile.name} field="name" editing={editing} editData={editData} onChange={handleChange} accentColor={accentColor} />
                    <InfoRow icon={<CakeOutlined />} label="Age" value={profile.age} field="age" editing={editing} editData={editData} onChange={handleChange} accentColor={accentColor} />
                    <InfoRow icon={<PhoneOutlined />} label="Mobile Number" value={profile.mobile} field="mobile" editing={editing} editData={editData} onChange={handleChange} accentColor={accentColor} />
                    {!isOwner && (
                        <InfoRow icon={<WorkOutline />} label="Experience" value={profile.experince} field="experince" editing={editing} editData={editData} onChange={handleChange} accentColor={accentColor} />
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        NIC numbers cannot be changed. Contact your administrator for assistance.
                    </Typography>
                </Paper>
            </motion.div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile;
