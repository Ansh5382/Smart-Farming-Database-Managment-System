import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Grid, Button, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress
} from '@mui/material';
import {
    PictureAsPdf, TableChart, Agriculture, WaterDrop, Grass, BugReport, Storage
} from '@mui/icons-material';
import { useNic } from '../components/NicContext.jsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { motion } from 'framer-motion';

const Reports = ({ role }) => {
    const { nic } = useNic();
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('harvest');
    const [data, setData] = useState([]);
    const accentColor = '#52796f';

    const isOwner = role === 'owner';

    useEffect(() => {
        fetchReportData();
    }, [reportType, nic, role]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (reportType) {
                case 'harvest':
                    endpoint = isOwner 
                        ? `http://localhost:8080/harvest/getAll` 
                        : `http://localhost:8080/harvest/byFarmer/${nic}`;
                    break;
                case 'crop':
                    endpoint = 'http://localhost:8080/hostcrop/getAll';
                    break;
                case 'disease':
                    endpoint = isOwner 
                        ? `http://localhost:8080/disease/getAll` 
                        : `http://localhost:8080/disease/byFarmer/${nic}`;
                    break;
                case 'storage':
                    endpoint = isOwner 
                        ? `http://localhost:8080/storage/getAll` 
                        : `http://localhost:8080/storage/byFarmer/${nic}`;
                    break;
                case 'irrigation':
                    endpoint = isOwner 
                        ? `http://localhost:8080/irrigation/getAll` 
                        : `http://localhost:8080/irrigation/byFarmer/${nic}`;
                    break;
                default:
                    endpoint = `http://localhost:8080/harvest/getAll`;
            }

            const res = await fetch(endpoint);
            if (res.ok) {
                const json = await res.json();
                setData(Array.isArray(json) ? json : []);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error('Error fetching report data:', err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setTextColor(82, 121, 111);
        doc.text('Smart Farming Report', 14, 22);
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 32);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);

        if (data.length === 0) {
            doc.setFontSize(14);
            doc.text('No data available', 14, 55);
            doc.save(`${reportType}_report.pdf`);
            return;
        }

        let headers = [];
        let rows = [];

        switch (reportType) {
            case 'harvest':
                headers = ['ID', 'Method', 'Time', 'Cost', 'Farmer NIC'];
                rows = data.map(item => [
                    item.methodID || '-',
                    item.method || '-',
                    item.time || '-',
                    item.cost || '-',
                    item.farmerNIC || '-'
                ]);
                break;
            case 'crop':
                headers = ['ID', 'Farmland ID', 'Disease ID', 'Disease Name', 'NIC', 'Date'];
                rows = data.map(item => [
                    item.hostcropID || '-',
                    item.farmlandID || '-',
                    item.diseaseID || '-',
                    item.diseaseName || '-',
                    item.nic || '-',
                    item.date || '-'
                ]);
                break;
            case 'disease':
                headers = ['ID', 'Name', 'Type', 'Transmission', 'Symptom', 'Farmer NIC'];
                rows = data.map(item => [
                    item.diseaseID || '-',
                    item.name || '-',
                    item.type || '-',
                    item.transmission || '-',
                    item.symptom || '-',
                    item.farmerNIC || '-'
                ]);
                break;
            case 'storage':
                headers = ['ID', 'Name', 'Location', 'Capacity', 'Humidity', 'Temperature', 'Farmer NIC'];
                rows = data.map(item => [
                    item.storageID || '-',
                    item.name || '-',
                    item.location || '-',
                    item.capacity || '-',
                    item.humidity || '-',
                    item.temperature || '-',
                    item.farmerNIC || '-'
                ]);
                break;
            case 'irrigation':
                headers = ['ID', 'Delivery', 'Source', 'Method', 'Maintainer NIC', 'Farmer NIC'];
                rows = data.map(item => [
                    item.systemID || '-',
                    item.delivery || '-',
                    item.source || '-',
                    item.method || '-',
                    item.maintainerNIC || '-',
                    item.farmerNIC || '-'
                ]);
                break;
            default:
                headers = ['ID', 'Data'];
                rows = data.map(item => [item.id || '-', JSON.stringify(item)]);
        }

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 50,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [82, 121, 111] }
        });

        doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const exportCSV = () => {
        if (data.length === 0) {
            alert('No data to export');
            return;
        }

        let rows = [];

        switch (reportType) {
            case 'harvest':
                rows = data.map(item => ({
                    ID: item.methodID || '',
                    Method: item.method || '',
                    Time: item.time || '',
                    Cost: item.cost || '',
                    'Farmer NIC': item.farmerNIC || ''
                }));
                break;
            case 'crop':
                rows = data.map(item => ({
                    ID: item.hostcropID || '',
                    'Farmland ID': item.farmlandID || '',
                    'Disease ID': item.diseaseID || '',
                    'Disease Name': item.diseaseName || '',
                    NIC: item.nic || '',
                    Date: item.date || ''
                }));
                break;
            case 'disease':
                rows = data.map(item => ({
                    ID: item.diseaseID || '',
                    Name: item.name || '',
                    Type: item.type || '',
                    Transmission: item.transmission || '',
                    Symptom: item.symptom || '',
                    'Farmer NIC': item.farmerNIC || ''
                }));
                break;
            case 'storage':
                rows = data.map(item => ({
                    ID: item.storageID || '',
                    Name: item.name || '',
                    Location: item.location || '',
                    Capacity: item.capacity || '',
                    Humidity: item.humidity || '',
                    Temperature: item.temperature || '',
                    'Farmer NIC': item.farmerNIC || ''
                }));
                break;
            case 'irrigation':
                rows = data.map(item => ({
                    ID: item.systemID || '',
                    Delivery: item.delivery || '',
                    Source: item.source || '',
                    Method: item.method || '',
                    'Maintainer NIC': item.maintainerNIC || '',
                    'Farmer NIC': item.farmerNIC || ''
                }));
                break;
            default:
                rows = data;
        }

        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const reportTypes = [
        { id: 'harvest', label: 'Harvest Reports', icon: <Agriculture /> },
        { id: 'crop', label: 'Crop Reports', icon: <Grass /> },
        { id: 'disease', label: 'Disease Reports', icon: <BugReport /> },
        { id: 'storage', label: 'Storage Reports', icon: <Storage /> },
        { id: 'irrigation', label: 'Irrigation Reports', icon: <WaterDrop /> }
    ];

    const getColumnHeaders = () => {
        switch (reportType) {
            case 'harvest':
                return ['ID', 'Method', 'Time', 'Cost', 'Farmer NIC'];
            case 'crop':
                return ['ID', 'Farmland ID', 'Disease ID', 'Disease Name', 'NIC', 'Date'];
            case 'disease':
                return ['ID', 'Name', 'Type', 'Transmission', 'Symptom', 'Farmer NIC'];
            case 'storage':
                return ['ID', 'Name', 'Location', 'Capacity', 'Humidity', 'Temperature', 'Farmer NIC'];
            case 'irrigation':
                return ['ID', 'Delivery', 'Source', 'Method', 'Maintainer NIC', 'Farmer NIC'];
            default:
                return ['ID', 'Data'];
        }
    };

    const renderTableRow = (row) => {
        switch (reportType) {
            case 'harvest':
                return (
                    <>
                        <TableCell>{row.methodID}</TableCell>
                        <TableCell>{row.method}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.cost}</TableCell>
                        <TableCell>{row.farmerNIC}</TableCell>
                    </>
                );
            case 'crop':
                return (
                    <>
                        <TableCell>{row.hostcropID}</TableCell>
                        <TableCell>{row.farmlandID}</TableCell>
                        <TableCell>{row.diseaseID}</TableCell>
                        <TableCell>{row.diseaseName}</TableCell>
                        <TableCell>{row.nic}</TableCell>
                        <TableCell>{row.date}</TableCell>
                    </>
                );
            case 'disease':
                return (
                    <>
                        <TableCell>{row.diseaseID}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.transmission}</TableCell>
                        <TableCell>{row.symptom}</TableCell>
                        <TableCell>{row.farmerNIC}</TableCell>
                    </>
                );
            case 'storage':
                return (
                    <>
                        <TableCell>{row.storageID}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.capacity}</TableCell>
                        <TableCell>{row.humidity}</TableCell>
                        <TableCell>{row.temperature}</TableCell>
                        <TableCell>{row.farmerNIC}</TableCell>
                    </>
                );
            case 'irrigation':
                return (
                    <>
                        <TableCell>{row.systemID}</TableCell>
                        <TableCell>{row.delivery}</TableCell>
                        <TableCell>{row.source}</TableCell>
                        <TableCell>{row.method}</TableCell>
                        <TableCell>{row.maintainerNIC}</TableCell>
                        <TableCell>{row.farmerNIC}</TableCell>
                    </>
                );
            default:
                return <TableCell colSpan={2}>{JSON.stringify(row)}</TableCell>;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: accentColor }}>
                            📊 Reports & Analytics
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                startIcon={<PictureAsPdf />}
                                onClick={generatePDF}
                                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#e74c3c' }}
                            >
                                Export PDF
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<TableChart />}
                                onClick={exportCSV}
                                sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#27ae60' }}
                            >
                                Export CSV
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {reportTypes.map((type) => (
                            <Grid item xs={6} sm={4} md={2.4} key={type.id}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        border: '2px solid',
                                        borderColor: reportType === type.id ? accentColor : 'transparent',
                                        bgcolor: reportType === type.id ? `${accentColor}15` : 'background.paper',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: accentColor, transform: 'translateY(-2px)' }
                                    }}
                                    onClick={() => setReportType(type.id)}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Box sx={{ color: accentColor, mb: 1 }}>{type.icon}</Box>
                                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                            {type.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: accentColor }} />
                        </Box>
                    ) : data.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No data available for {reportType} reports
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: `${accentColor}15` }}>
                                        {getColumnHeaders().map((header, index) => (
                                            <TableCell key={index} sx={{ fontWeight: 700, color: accentColor }}>
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.slice(0, 50).map((row, index) => (
                                        <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                                            {renderTableRow(row)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                        Showing up to 50 records. Use Export buttons to download full data.
                        {isOwner && ' (Showing ALL records for Owner)'}
                    </Typography>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Reports;
