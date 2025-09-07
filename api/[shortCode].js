// Vercel serverless function for URL redirection
import { kv } from '@vercel/kv';

// Database configuration
const DATABASE_NAME = 'link-shortening-test';

export default async function handler(req, res) {
  const { shortCode } = req.query;

  if (!shortCode) {
    return res.status(400).json({ error: 'Short code is required' });
  }

  try {
    // Get original URL from KV store
    const originalUrl = await kv.get(`${DATABASE_NAME}:code:${shortCode}`);

    if (!originalUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Redirect to original URL
    return res.redirect(302, originalUrl);

  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
