import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    IconButton,
    InputAdornment,
    Switch,
    Stack,
    Snackbar,
    FormControl,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Warning,
    LockOutlined,
    DarkMode,
    LightMode,
    Language,
} from '@mui/icons-material';
import { useNic } from '../components/NicContext.jsx';
import { useThemeMode } from '../components/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';

const Settings = ({ role }) => {
    const { nic, clearNic } = useNic();
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useThemeMode();
    
    // Local language state
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });
    
    const languageNames = {
        en: 'English',
        ta: 'Tamil (தமிழ்)',
        hi: 'Hindi (हिन्दी)',
        si: 'Sinhala (සිංහල)'
    };

    // Delete account state
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Change password state
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const isOwner = role === 'owner';
    const deleteThemeColor = isOwner ? '#7f1d1d' : '#d32f2f';
    const confirmationPhrase = isOwner ? 'DELETE OWNER ACCOUNT' : 'DELETE';
    const accentColor = '#52796f';

    // --- Change Password ---
    const handleChangePassword = async () => {
        setPwdError('');
        if (!currentPwd || !newPwd || !confirmPwd) {
            setPwdError('Please fill in all password fields.');
            return;
        }
        if (newPwd !== confirmPwd) {
            setPwdError('New password and confirmation do not match.');
            return;
        }
        if (newPwd.length < 4) {
            setPwdError('New password must be at least 4 characters.');
            return;
        }

        setPwdLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/${role}/changePassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nic, currentPassword: currentPwd, newPassword: newPwd }),
            });
            const result = await response.json();

            if (response.ok) {
                setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
                setCurrentPwd('');
                setNewPwd('');
                setConfirmPwd('');
            } else {
                setPwdError(result.error || 'Failed to change password.');
            }
        } catch (err) {
            setPwdError('Connection error. Please try again.');
        } finally {
            setPwdLoading(false);
        }
    };

    // --- Delete Account ---
    const handleOpenModal = () => {
        if (!password) {
            setError('Please enter your password to continue.');
            return;
        }
        setError('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setConfirmationText('');
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = `http://localhost:8080/${role}/delete`;
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nic, password }),
            });
            const result = await response.json();

            if (response.ok) {
                clearNic();
                navigate('/');
            } else {
                setError(result.error || 'Failed to delete account');
                handleCloseModal();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            handleCloseModal();
        } finally {
            setLoading(false);
        }
    };

    const PasswordField = ({ label, value, onChange, show, onToggle }) => (
        <TextField
            fullWidth
            label={label}
            type={show ? 'text' : 'password'}
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={onToggle} edge="end" size="small">
                            {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                {isOwner ? 'Property Management Settings' : 'Farmer Profile Settings'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {isOwner
                    ? 'Manage your administrative preferences and agricultural assets portfolio.'
                    : 'Review your personal details and cultivation performance history.'}
            </Typography>

            {/* ===== CHANGE PASSWORD SECTION ===== */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: accentColor }}>
                    <LockOutlined sx={{ color: accentColor }} /> Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your current password and choose a new one. Make sure it's at least 4 characters long.
                </Typography>

                {pwdError && <Alert severity="error" sx={{ mb: 2 }}>{pwdError}</Alert>}

                <Box sx={{ maxWidth: 400 }}>
                    <PasswordField
                        label="Current Password"
                        value={currentPwd}
                        onChange={setCurrentPwd}
                        show={showCurrentPwd}
                        onToggle={() => setShowCurrentPwd(!showCurrentPwd)}
                    />
                    <PasswordField
                        label="New Password"
                        value={newPwd}
                        onChange={setNewPwd}
                        show={showNewPwd}
                        onToggle={() => setShowNewPwd(!showNewPwd)}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type={showNewPwd ? 'text' : 'password'}
                        variant="outlined"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        error={confirmPwd !== '' && newPwd !== confirmPwd}
                        helperText={confirmPwd !== '' && newPwd !== confirmPwd ? 'Passwords do not match' : ''}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleChangePassword}
                        disabled={pwdLoading}
                        sx={{
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                    >
                        {pwdLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                </Box>
            </Paper>

            {/* ===== DARK MODE SECTION ===== */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: accentColor }}>
                    {darkMode ? <DarkMode sx={{ color: accentColor }} /> : <LightMode sx={{ color: accentColor }} />} Appearance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Toggle between light and dark mode for a comfortable viewing experience.
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 400, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {darkMode ? <DarkMode sx={{ color: '#84a98c' }} /> : <LightMode sx={{ color: '#f59e0b' }} />}
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </Typography>
                    </Box>
                    <Switch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        color="primary"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#84a98c',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#84a98c',
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* ===== DANGER ZONE ===== */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: deleteThemeColor, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning sx={{ color: deleteThemeColor }} /> {isOwner ? 'Account Dissolution' : 'Danger Zone'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {isOwner
                        ? "CRITICAL: Deleting your owner account will permanently dissolve all associated farmlands, crop data, and registered farmer associations. There is no recovery process."
                        : "Once you delete your farmer profile, you will be removed from all assigned plots and your performance history will be wiped."}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Box sx={{ maxWidth: 400 }}>
                    <TextField
                        fullWidth
                        label="Security Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleOpenModal}
                        sx={{
                            py: 1.5,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2,
                            bgcolor: deleteThemeColor,
                            '&:hover': { bgcolor: isOwner ? '#5b1515' : '#b71c1c' },
                            boxShadow: `0 4px 12px ${deleteThemeColor}33`
                        }}
                    >
                        {isOwner ? 'Dissolve Owner Account' : 'Delete Account'}
                    </Button>
                </Box>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle sx={{ fontWeight: 900, color: deleteThemeColor }}>
                    {isOwner ? 'PERMANENT DISSOLUTION' : 'Are you sure?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
                        {isOwner
                            ? 'You are about to initiate a permanent dissolution of your agricultural portfolio. All data relating to your lands and personnel will be lost.'
                            : 'This action cannot be undone. You will lose access to all assigned farmlands and tasks.'}
                    </DialogContentText>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Please type <strong>{confirmationPhrase}</strong> to proceed.
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={confirmationPhrase}
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        error={confirmationText !== '' && confirmationText !== confirmationPhrase}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseModal} sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        Abort
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        variant="contained"
                        disabled={confirmationText !== confirmationPhrase || loading}
                        sx={{
                            fontWeight: 700,
                            bgcolor: deleteThemeColor,
                            '&:hover': { bgcolor: isOwner ? '#5b1515' : '#b71c1c' }
                        }}
                    >
                        {loading ? 'Processing...' : (isOwner ? 'Confirm Dissolution' : 'Confirm Deletion')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
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

export default Settings;
