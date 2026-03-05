const VERITAS_API_KEY = process.env.VERITAS_API_KEY || 'vos_qc8bd4diKkODFyyT6TIkuto9WtKXcFur';
const VERITAS_BASE_URL = 'https://veritasosint.net/api/v1';

async function handler(request, response) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { query, type } = request.body;

  if (!query) {
    return response.status(400).json({
      success: false,
      error: 'Missing query parameter. Provide email, phone, IP, username, domain, or Discord ID.'
    });
  }

  try {
    console.log(`🔍 VeritasOSINT Lookup: "${query}" (type: ${type || 'auto'})`);

    // Build request body
    const requestBody = { query };
    if (type && type !== 'auto') {
      requestBody.type = type;
    }

    // Call VeritasOSINT API
    const veritasResponse = await fetch(`${VERITAS_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': VERITAS_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    // Check rate limit headers
    const rateLimit = veritasResponse.headers.get('X-RateLimit-Limit');
    const rateLimitRemaining = veritasResponse.headers.get('X-RateLimit-Remaining');
    const rateLimitReset = veritasResponse.headers.get('X-RateLimit-Reset');

    if (rateLimit) {
      console.log(`📊 Rate Limit: ${rateLimitRemaining || '?'}/${rateLimit} (resets: ${rateLimitReset || 'unknown'})`);
    }

    if (!veritasResponse.ok) {
      const errorData = await veritasResponse.json().catch(() => ({}));
      
      console.error('❌ VeritasOSINT error:', veritasResponse.status, errorData);

      let errorMessage = 'Failed to query VeritasOSINT';
      if (veritasResponse.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (veritasResponse.status === 403) {
        errorMessage = 'API access forbidden (account suspended or plan expired)';
      } else if (veritasResponse.status === 429) {
        errorMessage = 'Rate limited. Please wait before making more requests.';
      } else if (veritasResponse.status === 400) {
        errorMessage = 'Invalid query format';
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

      return response.status(veritasResponse.status).json({
        success: false,
        error: errorMessage
      });
    }

    const data = await veritasResponse.json();

    console.log(`✅ VeritasOSINT Success: ${data.totalResults || 0} results from ${data.providers || 0} providers`);

    // Return the data
    return response.status(200).json(data);

  } catch (error) {
    console.error('❌ OSINT handler error:', error.message);
    return response.status(500).json({
      success: false,
      error: `Internal error: ${error.message}`
    });
  }
}

module.exports = handler;
