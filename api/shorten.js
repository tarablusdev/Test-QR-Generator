// Vercel serverless function for URL shortening
import { kv } from '@vercel/kv';

// Generate random short code
function generateShortCode(length = 7) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL already exists
    const existingCode = await kv.get(`url:${url}`);
    if (existingCode) {
      return res.status(200).json({
        shortUrl: `https://qubex.it/${existingCode}`,
        shortCode: existingCode,
        originalUrl: url
      });
    }

    // Generate unique short code
    let shortCode;
    let attempts = 0;
    do {
      shortCode = generateShortCode();
      attempts++;
      if (attempts > 10) {
        return res.status(500).json({ error: 'Unable to generate unique short code' });
      }
    } while (await kv.get(`code:${shortCode}`));

    // Store mappings
    await kv.set(`code:${shortCode}`, url);
    await kv.set(`url:${url}`, shortCode);
    
    // Set expiration (optional - 1 year).
    await kv.expire(`code:${shortCode}`, 31536000);
    await kv.expire(`url:${url}`, 31536000);

    return res.status(200).json({
      shortUrl: `https://qubex.it/${shortCode}`,
      shortCode,
      originalUrl: url
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
