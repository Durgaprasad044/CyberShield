import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface ScanResult {
  scan_id: string;
  report: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
  };
}

const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/scan', { url });
      setResult(response.data);
    } catch (err) {
      setError('Failed to scan website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (result: ScanResult) => {
    if (result.report.malicious > 0) return 'error';
    if (result.report.suspicious > 0) return 'warning';
    return 'success';
  };

  const getMessage = (result: ScanResult) => {
    if (result.report.malicious > 0) {
      return 'This website appears to be malicious. Do not proceed.';
    }
    if (result.report.suspicious > 0) {
      return 'This website appears to be suspicious. Proceed with caution.';
    }
    return 'This website appears to be safe. However, always be cautious when sharing personal information.';
  };

  return (
    <Box
      sx={{
        pt: 12,
        pb: 6,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{ color: 'white', mb: 4 }}
        >
          Website Scanner
        </Typography>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            type="url"
            variant="outlined"
            placeholder="Enter website URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !url.trim()}
            sx={{
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Scan Website'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Alert severity={getSeverity(result)} sx={{ mt: 3 }}>
              <Typography variant="h6" component="div" gutterBottom>
                Scan Results
              </Typography>
              <Typography gutterBottom>{getMessage(result)}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Scan ID: {result.scan_id}
                </Typography>
                <Typography variant="body2">
                  Harmless: {result.report.harmless}
                </Typography>
                <Typography variant="body2">
                  Malicious: {result.report.malicious}
                </Typography>
                <Typography variant="body2">
                  Suspicious: {result.report.suspicious}
                </Typography>
                <Typography variant="body2">
                  Undetected: {result.report.undetected}
                </Typography>
              </Box>
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default WebsiteScanner; 