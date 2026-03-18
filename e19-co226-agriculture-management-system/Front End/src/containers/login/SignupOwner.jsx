import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Snackbar,
    Box,
    Paper,
    InputAdornment,
    IconButton,
    Grid,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import backgroundImage from '../../assets/background/background.jpg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignupOwner = () => {
    const [nic, setNic] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [mobile, setMobile] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [generatedSQL, setGeneratedSQL] = useState('');
    const [showSQL, setShowSQL] = useState(false);

    const navigate = useNavigate();
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const containerStyle = {
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
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
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
        }
    };

    const boxStyle = {
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
        maxWidth: '600px',
        width: '100%',
        border: '3px solid',
        borderImage: 'linear-gradient(135deg, #52796f, #84a98c, #cad2c5) 1',
        position: 'relative',
        zIndex: 1,
    };

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            '&:hover fieldset': {
                borderColor: '#52796f',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#52796f',
                borderWidth: '2px',
            },
            '& fieldset': {
                borderColor: '#cbd5e1',
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#64748b',
            fontWeight: 600,
            '&.Mui-focused': {
                color: '#52796f',
            },
        },
    };

    const buttonStyle = {
        background: 'linear-gradient(135deg, #52796f 0%, #84a98c 50%, #cad2c5 100%)',
        color: 'white',
        padding: '16px 32px',
        fontSize: '16px',
        fontWeight: 700,
        borderRadius: '12px',
        textTransform: 'none',
        width: '100%',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
            background: 'linear-gradient(135deg, #52796f 0%, #84a98c 50%, #cad2c5 100%)',
            boxShadow: '0 15px 35px rgba(59, 130, 246, 0.5)',
            transform: 'translateY(-2px)',
        },
    };

    const handleSignUp = async () => {
        if (!nic || !name || !password) {
            setErrorMessage('All required fields must be filled.');
            setErrorSnackbarOpen(true);
            return;
        }

        // Generate SQL query for DBMS project demonstration
        const sqlQuery = `INSERT INTO owner (nic, password, name, mobile, age) 
VALUES ('${nic}', '${password}', '${name}', '${mobile || 'NULL'}', ${age || 'NULL'});`;
        
        setGeneratedSQL(sqlQuery);
        setShowSQL(true);

        try {
            const response = await fetch(`http://localhost:8080/owner/addNew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nic: nic,
                    password: password,
                    name: name,
                    mobile: mobile,
                    age: age,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/`);
            } else {
                setErrorMessage(data.error);
                setErrorSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    const handleSnackbarClose = () => {
        setErrorSnackbarOpen(false);
        setErrorMessage('');
    };

    return (
        <Box sx={containerStyle}>
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                
                {/* Title Section - Perfectly Centered */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '20px 40px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        border: '2px solid rgba(16, 185, 129, 0.3)',
                    }}
                >
                    <BusinessIcon 
                        sx={{ 
                            fontSize: 56, 
                            color: '#52796f',
                        }} 
                    />
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 800, 
                            color: '#ffffff',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Join as Owner
                    </Typography>
                </Box>

                {/* Signup Form - Perfectly Aligned */}
                <Paper elevation={0} sx={boxStyle}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 1, 
                                fontWeight: 800,
                                color: '#1e293b',
                            }}
                        >
                            Create Your Account
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#64748b',
                                fontWeight: 500,
                            }}
                        >
                            Register as a land owner
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* NIC - Full Width */}
                        <Grid item xs={12}>
                            <TextField
                                label="National Identity Card (NIC)"
                                required
                                fullWidth
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon sx={{ color: '#52796f', fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Name - Full Width */}
                        <Grid item xs={12}>
                            <TextField
                                label="Full Name"
                                required
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Age and Mobile - Side by Side */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Age"
                                fullWidth
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                sx={textFieldStyle}
                                inputProps={{
                                    min: 18,
                                    max: 100,
                                    step: 1,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CakeIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mobile Number"
                                required
                                fullWidth
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ color: '#8b5cf6', fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Password - Full Width */}
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                required
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={textFieldStyle}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#64748b' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Buttons Section - Perfectly Aligned */}
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={handleSignUp}
                            sx={buttonStyle}
                        >
                            Create Owner Account
                        </Button>

                        {/* DBMS Project - View SQL Toggle */}
                        <Button
                            variant="outlined"
                            onClick={() => setShowSQL(!showSQL)}
                            sx={{
                                width: '100%',
                                color: '#52796f',
                                borderColor: '#52796f',
                                borderWidth: '2px',
                                fontWeight: 600,
                                padding: '12px',
                                borderRadius: '12px',
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#354f52',
                                    borderWidth: '2px',
                                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                },
                            }}
                        >
                            {showSQL ? '🔒 Hide SQL Query' : '👁️ View Generated SQL Query'}
                        </Button>
                    </Box>

                    {/* Sign In Link - Centered */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography 
                            variant="body1" 
                            sx={{ color: '#64748b', fontWeight: 500 }}
                        >
                            Already have an account?{' '}
                            <Link 
                                to="/" 
                                style={{ 
                                    color: '#52796f', 
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Paper>

                {/* SQL Query Display Panel - Perfectly Aligned */}
                {showSQL && generatedSQL && (
                    <Paper 
                        elevation={3}
                        sx={{
                            maxWidth: '600px',
                            width: '100%',
                            background: '#1e293b',
                            padding: '24px',
                            borderRadius: '20px',
                            border: '2px solid #52796f',
                            position: 'relative',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#52796f',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                📊 Generated SQL Query
                            </Typography>
                            <IconButton 
                                onClick={() => setShowSQL(false)}
                                sx={{ 
                                    color: '#ef4444',
                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                                }}
                            >
                                ✕
                            </IconButton>
                        </Box>
                        
                        <Box
                            sx={{
                                backgroundColor: '#0f172a',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #334155',
                                overflow: 'auto',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    color: '#22c55e',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.6,
                                }}
                            >
                                {generatedSQL}
                            </Typography>
                        </Box>
                        
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: '#94a3b8',
                                display: 'block',
                                mt: 2,
                                fontStyle: 'italic',
                                textAlign: 'center',
                            }}
                        >
                            * This INSERT query will be executed on the MySQL database
                        </Typography>
                    </Paper>
                )}

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
                    sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SignupOwner;