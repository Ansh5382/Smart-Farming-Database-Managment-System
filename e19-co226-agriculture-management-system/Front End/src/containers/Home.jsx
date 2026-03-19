import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Snackbar,
    TextField,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Avatar,
    CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNic } from "../components/NicContext.jsx";
import backgroundImage from '../assets/background/background.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('farmer');
    const [nicValue, setNicValue] = useState('');
    const [password, setPassword] = useState('');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { setSession, isAuthenticated, role, isLoading } = useNic();

    React.useEffect(() => {
        if (isLoading || !isAuthenticated) {
            return;
        }

        navigate(role === 'owner' ? '/ownerhome' : '/farmerhome', { replace: true });
    }, [isAuthenticated, navigate, role, isLoading]);

    const handleSignIn = async () => {
        if (!nicValue || !password) {
            setErrorMessage('Please enter both NIC and password');
            setErrorSnackbarOpen(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/${userType}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nic: nicValue,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSession(data);
                navigate(userType === 'owner' ? '/ownerhome' : '/farmerhome');
            } else {
                setErrorMessage(data.error || 'Login failed');
                setErrorSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Connection error. Please check if backend is running.');
            setErrorSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setErrorSnackbarOpen(false);
        setErrorMessage('');
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fff' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(3px)'
            }
        }}>
            <Container 
                maxWidth="sm" 
                sx={{ position: 'relative', zIndex: 1 }}
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                
                {/* Logo and Title */}
                <Box 
                    sx={{ textAlign: 'center', mb: 4 }}
                    component={motion.div}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
                >
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            margin: '0 auto 16px',
                            background: 'linear-gradient(135deg, #52796f 0%, #354f52 100%)',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                        }}
                    >
                        <AgricultureIcon sx={{ fontSize: 50, color: 'white' }} />
                    </Avatar>

                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 800,
                            color: 'white',
                            mb: 1,
                            textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        CropMaster
                    </Typography>

                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: '#e2e8f0',
                            fontWeight: 600,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Smart Agriculture Management
                    </Typography>
                </Box>

                {/* Login Card */}
                <Paper 
                    elevation={8}
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '40px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <Typography 
                        variant="h5" 
                        align="center" 
                        sx={{ 
                            mb: 1, 
                            fontWeight: 700,
                            color: '#1e293b',
                        }}
                    >
                        Welcome Back
                    </Typography>

                    <Typography 
                        variant="body2" 
                        align="center" 
                        sx={{ 
                            mb: 3, 
                            color: '#64748b',
                        }}
                    >
                        Sign in to continue
                    </Typography>

                    {/* User Type Selection */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button
                            variant={userType === 'farmer' ? 'contained' : 'outlined'}
                            onClick={() => setUserType('farmer')}
                            fullWidth
                            sx={{
                                padding: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '10px',
                                ...(userType === 'farmer' ? {
                                    background: 'linear-gradient(135deg, #52796f 0%, #354f52 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #52796f 0%, #354f52 100%)',
                                    }
                                } : {
                                    color: '#52796f',
                                    borderColor: '#52796f',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                        borderWidth: '2px',
                                    }
                                })
                            }}
                        >
                            🌾 Farmer
                        </Button>

                        <Button
                            variant={userType === 'owner' ? 'contained' : 'outlined'}
                            onClick={() => setUserType('owner')}
                            fullWidth
                            sx={{
                                padding: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '10px',
                                ...(userType === 'owner' ? {
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    }
                                } : {
                                    color: '#3b82f6',
                                    borderColor: '#3b82f6',
                                    borderWidth: '2px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                        borderWidth: '2px',
                                    }
                                })
                            }}
                        >
                            🏢 Owner
                        </Button>
                    </Box>

                    {/* NIC Field */}
                    <TextField
                        label="National Identity Card (NIC)"
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        value={nicValue}
                        onChange={(e) => setNicValue(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f8fafc',
                                '& fieldset': {
                                    borderColor: '#cbd5e1',
                                    borderWidth: '2px',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#52796f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#52796f',
                                },
                            },
                        }}
                        inputProps={{ autoComplete: 'nope' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: '#52796f' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        fullWidth
                        margin="normal"
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        inputProps={{ autoComplete: 'new-password' }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f8fafc',
                                '& fieldset': {
                                    borderColor: '#cbd5e1',
                                    borderWidth: '2px',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#52796f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#52796f',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#ef4444' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Sign In Button */}
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleSignIn} 
                        fullWidth
                        endIcon={<LoginIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #52796f 0%, #84a98c 50%, #cad2c5 100%)',
                            color: 'white',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: 700,
                            borderRadius: '10px',
                            textTransform: 'none',
                            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #52796f 0%, #84a98c 50%, #cad2c5 100%)',
                                boxShadow: '0 12px 28px rgba(59, 130, 246, 0.4)',
                            },
                        }}
                    >
                        Sign In
                    </Button>

                    {/* Divider */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        my: 3,
                        '&::before, &::after': {
                            content: '""',
                            flex: 1,
                            borderBottom: '1px solid #e2e8f0',
                        },
                    }}>
                        <Typography sx={{ px: 2, color: '#94a3b8', fontSize: '13px' }}>
                            NEW USER?
                        </Typography>
                    </Box>

                    {/* Signup Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/signupfarmer")}
                            fullWidth
                            sx={{
                                background: '#52796f',
                                color: 'white',
                                fontWeight: 600,
                                padding: '10px',
                                textTransform: 'none',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#354f52',
                                },
                            }}
                        >
                            Farmer Signup
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/signupowner")}
                            fullWidth
                            sx={{
                                background: '#84a98c',
                                color: 'white',
                                fontWeight: 600,
                                padding: '10px',
                                textTransform: 'none',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#52796f',
                                },
                            }}
                        >
                            Owner Signup
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Snackbar 
                open={errorSnackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="error"
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
