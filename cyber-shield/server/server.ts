import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { MultinomialNB } from 'ml-naivebayes';
import { CountVectorizer } from 'ml-preprocessing';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize ML model
let clf: MultinomialNB;
let vectorizer: CountVectorizer;

// Load and train model
const loadModel = async () => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Apaulgithub/oibsip_taskno4/main/spam.csv');
    const data = response.data.split('\n').map((row: string) => row.split(','));
    
    // Remove header and empty rows
    const cleanData = data.slice(1).filter((row: string[]) => row.length >= 2);
    
    const X = cleanData.map((row: string[]) => row[1]); // Message column
    const y = cleanData.map((row: string[]) => row[0] === 'spam' ? 1 : 0); // Category column
    
    // Initialize and fit vectorizer
    vectorizer = new CountVectorizer();
    const X_vectorized = vectorizer.fit_transform(X);
    
    // Train model
    clf = new MultinomialNB();
    clf.train(X_vectorized, y);
    
    console.log('Model loaded and trained successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

// Load model on startup
loadModel();

// Email detection endpoint
app.post('/detect', (req, res) => {
  try {
    const { email_text } = req.body;
    
    if (!email_text) {
      return res.status(400).json({ error: 'Email text is required' });
    }
    
    // Vectorize input
    const X_test = vectorizer.transform([email_text]);
    
    // Predict
    const prediction = clf.predict(X_test)[0];
    const result = prediction === 1 ? 'Spam Email!' : 'Not Spam Email!';
    
    res.json({ result });
  } catch (error) {
    console.error('Error in detection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Website scanning endpoint
const API_KEY = process.env.VIRUSTOTAL_API_KEY;

app.post('/scan', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'VirusTotal API key not configured' });
    }
    
    // Submit URL for scanning
    const scanResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      { url },
      {
        headers: { 'x-apikey': API_KEY }
      }
    );
    
    const scan_id = scanResponse.data.data.id;
    
    // Get scan results
    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${scan_id}`,
      {
        headers: { 'x-apikey': API_KEY }
      }
    );
    
    const stats = resultResponse.data.data.attributes.stats;
    
    res.json({ scan_id, report: stats });
  } catch (error) {
    console.error('Error in website scan:', error);
    res.status(500).json({ error: 'Failed to scan website' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 