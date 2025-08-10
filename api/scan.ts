import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
        timeout: 10000
      }
    );
    
    const scan_id = scanResponse.data.data.id;
    
    // Wait a moment for initial scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get scan results
    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${scan_id}`,
      {
        headers: { 'x-apikey': API_KEY },
        timeout: 10000
      }
    );
    
    const stats = resultResponse.data.data.attributes.stats;
    
    res.json({ scan_id, report: stats });
  } catch (error) {
    console.error('Error in website scan:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' });
      }
      if (error.response?.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
    }
    
    res.status(500).json({ error: 'Failed to scan website' });
  }
}