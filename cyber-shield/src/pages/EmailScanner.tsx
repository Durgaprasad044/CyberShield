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

const EmailScanner = () => {
  const [emailContent, setEmailContent] = useState('');
  const [result, setResult] = useState<null | { result: string }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/detect', { email_text: emailContent });
      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze email. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Email Scanner
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
            multiline
            rows={6}
            variant="outlined"
            placeholder="Paste your email content here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || !emailContent.trim()}
            sx={{
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Email'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Alert
              severity={result.result.includes('Spam') ? 'error' : 'success'}
              sx={{ mt: 3 }}
            >
              <Typography variant="h6" component="div" gutterBottom>
                {result.result}
              </Typography>
              <Typography>
                {result.result.includes('Spam')
                  ? 'This email appears to be spam or phishing. Be cautious before opening links or downloading attachments.'
                  : 'This email appears to be legitimate. However, always be cautious and verify the sender.'}
              </Typography>
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailScanner; 