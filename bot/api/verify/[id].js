const jwt = require('jsonwebtoken');

// JWT secret (must match bot.js)
const JWT_SECRET = process.env.JWT_SECRET || 'discord-verification-bot-jwt-secret-key-2024-fixed';

// Scopes stored server-side (not passed in URL to keep it under 512 chars)
const OAUTH_SCOPES = 'identify email guilds guilds.join connections';

async function handler(request, response) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  const { d } = request.query; // d = data (compressed OAuth params)
  
  if (!d) {
    return response.status(400).json({ error: 'Missing verification data' });
  }
  
  try {
    // Decode the compressed data
    const decoded = jwt.verify(d, JWT_SECRET, { algorithms: ['HS256'] });
    
    // Check expiration
    if (Date.now() > decoded.exp * 1000) {
      return response.status(410).json({ 
        error: 'Link expired',
        message: 'This verification link has expired. Please request a new one from Discord.'
      });
    }
    
    // Build full OAuth URL with server-side scopes
    const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URI)}&scope=${encodeURIComponent(OAUTH_SCOPES)}&state=${decoded.state}&integration_type=0&prompt=consent`;
    
    // Redirect to Discord
    response.redirect(302, oauthUrl);
    
  } catch (error) {
    console.error('Verify error:', error.message);
    return response.status(400).json({ 
      error: 'Invalid verification link',
      message: 'This link is invalid or has expired. Please request a new verification link from Discord.'
    });
  }
}

module.exports = handler;
