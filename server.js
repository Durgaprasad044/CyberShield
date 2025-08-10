const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'cyber-shield/build')));

// Simple spam detection using keyword-based approach
const spamKeywords = [
  'free', 'winner', 'congratulations', 'urgent', 'limited time',
  'click here', 'act now', 'offer expires', 'guaranteed', 'no obligation',
  'risk free', 'cash bonus', 'earn money', 'work from home', 'make money fast',
  'viagra', 'cialis', 'pharmacy', 'prescription', 'weight loss',
  'lottery', 'prize', 'sweepstakes', 'inheritance', 'beneficiary',
  'nigerian prince', 'bank transfer', 'wire transfer', 'western union',
  'credit card', 'social security', 'tax refund', 'irs', 'government grant'
];

function detectSpam(text) {
  const lowerText = text.toLowerCase();
  let spamScore = 0;
  
  spamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      spamScore++;
    }
  });
  
  // Additional checks
  const hasExcessiveCaps = (text.match(/[A-Z]/g) || []).length > text.length * 0.3;
  const hasExcessiveExclamation = (text.match(/!/g) || []).length > 3;
  const hasMoneySymbols = /[$£€¥₹]/.test(text);
  const hasPhoneNumbers = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
  const hasUrls = /https?:\/\/[^\s]+/.test(text);
  
  if (hasExcessiveCaps) spamScore += 2;
  if (hasExcessiveExclamation) spamScore += 1;
  if (hasMoneySymbols) spamScore += 1;
  if (hasPhoneNumbers) spamScore += 1;
  if (hasUrls) spamScore += 1;
  
  // If more than 3 spam indicators found, consider it spam
  return spamScore > 3;
}

// API Routes
app.post('/api/detect', (req, res) => {
  try {
    const { email_text } = req.body;
    
    if (!email_text) {
      return res.status(400).json({ error: 'Email text is required' });
    }
    
    const isSpam = detectSpam(email_text);
    const result = isSpam ? 'Spam Email!' : 'Not Spam Email!';
    
    res.json({ result });
  } catch (error) {
    console.error('Error in detection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/scan', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const API_KEY = process.env.VIRUSTOTAL_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'VirusTotal API key not configured' });
    }
    
    // Submit URL for scanning
    const scanResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      { url },
      {
        headers: { 'x-apikey': API_KEY },
        timeout: 15000
      }
    );
    
    const scan_id = scanResponse.data.data.id;
    
    // Wait a moment for initial scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get scan results
    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${scan_id}`,
      {
        headers: { 'x-apikey': API_KEY },
        timeout: 15000
      }
    );
    
    const stats = resultResponse.data.data.attributes.stats;
    
    res.json({ scan_id, report: stats });
  } catch (error) {
    console.error('Error in website scan:', error);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Request timeout. Please try again.' });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    res.status(500).json({ error: 'Failed to scan website' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'cyber-shield/build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 CyberShield server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔌 API: http://localhost:${port}/api`);
});