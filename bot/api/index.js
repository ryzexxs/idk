async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'text/html');
  
  response.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Discord Verification Bot</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          text-align: center; padding: 50px 20px; 
          background: #2c2f33; color: white; 
        }
        .card { 
          background: #23272a; 
          border-radius: 10px; 
          padding: 40px; 
          max-width: 500px; 
          margin: 0 auto; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
        }
        h1 { color: #5865F2; }
        p { color: #99aab5; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🔐 Discord Verification Bot</h1>
        <p>This bot provides secure verification for Discord servers using OAuth2.</p>
        <p>If you're seeing this page, the bot is running correctly!</p>
      </div>
    </body>
    </html>
  `);
}

module.exports = handler;
