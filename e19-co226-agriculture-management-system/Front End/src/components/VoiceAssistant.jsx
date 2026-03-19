import React, { useState, useEffect, useRef } from 'react';
import { Box, Fab, Tooltip, Dialog, DialogTitle, DialogContent, Typography, IconButton, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Mic, MicOff, VolumeUp, Close, NavigateNext, Home, Person, Settings, Description, AgriculturalEstate } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNic } from './NicContext.jsx';

const VoiceAssistant = ({ role }) => {
    const [isListening, setIsListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState('');
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const { clearNic } = useNic();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                const result = event.results[current][0].transcript;
                setTranscript(result);
                
                if (event.results[current].isFinal) {
                    processCommand(result.toLowerCase());
                }
            };

            recognitionRef.current.onerror = (event) => {
                setError('Voice recognition error: ' + event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const processCommand = (command) => {
        setLastCommand(command);
        
        // Navigation commands
        if (command.includes('home') || command.includes('dashboard')) {
            speak('Navigating to home');
            navigate(role === 'owner' ? '/owner' : '/farmer');
        } else if (command.includes('profile')) {
            speak('Navigating to profile');
            navigate('/profile');
        } else if (command.includes('settings')) {
            speak('Navigating to settings');
            navigate('/settings');
        } else if (command.includes('report')) {
            speak('Navigating to reports');
            navigate('/reports');
        } else if (command.includes('farmland') || command.includes('farm')) {
            speak('Navigating to farmland');
            navigate(role === 'owner' ? '/owner' : '/farmer');
        } else if (command.includes('harvest')) {
            speak('Navigating to harvest');
            navigate('/harvest');
        } else if (command.includes('irrigation') || command.includes('water')) {
            speak('Navigating to irrigation');
            navigate('/irrigation');
        } else if (command.includes('storage')) {
            speak('Navigating to storage');
            navigate('/storage');
        } else if (command.includes('disease')) {
            speak('Navigating to disease reporting');
            navigate('/report-disease');
        } else if (command.includes('weather')) {
            speak('Navigating to weather');
            navigate('/update-weather');
        } else if (command.includes('soil')) {
            speak('Navigating to soil update');
            navigate('/update-soil');
        } else if (command.includes('logout') || command.includes('sign out')) {
            speak('Logging out');
            clearNic();
            navigate('/');
        } else {
            speak('Command not recognized. Try saying home, profile, settings, or reports.');
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setError('');
            setTranscript('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                setError('Could not start voice recognition');
            }
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const quickCommands = [
        { label: 'Go to Home', icon: <Home />, command: 'home' },
        { label: 'Go to Profile', icon: <Person />, command: 'profile' },
        { label: 'Go to Settings', icon: <Settings />, command: 'settings' },
        { label: 'Go to Reports', icon: <Description />, command: 'reports' },
        { label: 'Go to Farmland', icon: <AgriculturalEstate />, command: 'farmland' },
    ];

    const executeCommand = (cmd) => {
        processCommand(cmd);
    };

    return (
        <>
            <Tooltip title={isListening ? "Stop listening" : "Voice Assistant"} placement="left">
                <Fab
                    color={isListening ? "error" : "primary"}
                    onClick={() => setIsOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        bgcolor: isListening ? '#ef4444' : '#52796f',
                        '&:hover': {
                            bgcolor: isListening ? '#dc2626' : '#354f52',
                        },
                        boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 4px 12px rgba(82, 121, 111, 0.3)',
                    }}
                >
                    {isListening ? <MicOff /> : <Mic />}
                </Fab>
            </Tooltip>

            <Dialog 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Mic color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Voice Assistant
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setIsOpen(false)} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Fab
                            color={isListening ? "error" : "primary"}
                            onClick={toggleListening}
                            sx={{
                                width: 80,
                                height: 80,
                                mb: 2,
                                bgcolor: isListening ? '#ef4444' : '#52796f',
                                '&:hover': {
                                    bgcolor: isListening ? '#dc2626' : '#354f52',
                                },
                                animation: isListening ? 'pulse 1.5s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
                                    '70%': { boxShadow: '0 0 0 20px rgba(239, 68, 68, 0)' },
                                    '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                                }
                            }}
                        >
                            {isListening ? <MicOff sx={{ fontSize: 36 }} /> : <Mic sx={{ fontSize: 36 }} />}
                        </Fab>
                        
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            {isListening ? "Listening..." : "Tap to speak"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isListening ? "Say a command like 'Go to profile'" : "Try: 'Go to home', 'Open settings', 'Show reports'"}
                        </Typography>
                    </Box>

                    {transcript && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                You said:
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                "{transcript}"
                            </Typography>
                        </Box>
                    )}

                    {lastCommand && !transcript && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.main', borderRadius: 2, opacity: 0.1 }}>
                            <Typography variant="body2" color="white">
                                Executed: {lastCommand}
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                            <Typography variant="body2" color="error.contrastText">
                                {error}
                            </Typography>
                        </Box>
                    )}

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, mt: 2 }}>
                        Quick Commands:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {quickCommands.map((cmd, index) => (
                            <Chip
                                key={index}
                                icon={cmd.icon}
                                label={cmd.label}
                                onClick={() => executeCommand(cmd.command)}
                                sx={{ 
                                    bgcolor: 'background.default',
                                    '&:hover': { bgcolor: 'primary.light', color: 'white' }
                                }}
                            />
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default VoiceAssistant;
