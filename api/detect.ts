import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// Simple spam detection using keyword-based approach for Vercel
const spamKeywords = [
  'free', 'winner', 'congratulations', 'urgent', 'limited time',
  'click here', 'act now', 'offer expires', 'guaranteed', 'no obligation',
  'risk free', 'cash bonus', 'earn money', 'work from home', 'make money fast',
  'viagra', 'cialis', 'pharmacy', 'prescription', 'weight loss',
  'lottery', 'prize', 'sweepstakes', 'inheritance', 'beneficiary'
];

function detectSpam(text: string): boolean {
  const lowerText = text.toLowerCase();
  let spamScore = 0;
  
  spamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      spamScore++;
    }
  });
  
  // If more than 2 spam keywords found, consider it spam
  return spamScore > 2;
}

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
}