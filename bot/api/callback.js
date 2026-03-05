const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'discord-verification-bot-jwt-secret-key-2024-fixed';

// Generate device fingerprint from user agent and other headers
function getDeviceFingerprint(headers) {
  const userAgent = headers['user-agent'] || 'Unknown';
  const acceptLanguage = headers['accept-language'] || 'Unknown';
  const secClient = headers['sec-ch-ua'] || '';
  const secPlatform = headers['sec-ch-ua-platform'] || '';
  const secMobile = headers['sec-ch-ua-mobile'] || '';
  
  // Parse user agent for basic info
  let os = 'Unknown';
  let browser = 'Unknown';
  let deviceType = 'Desktop';
  
  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) { os = 'Android'; deviceType = 'Mobile'; }
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) { os = 'iOS'; deviceType = 'Mobile'; }
  
  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
  
  // Create simple fingerprint hash
  const fingerprintData = `${userAgent}${acceptLanguage}${secClient}`;
  const simpleHash = fingerprintData.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return {
    fingerprint: Math.abs(simpleHash).toString(16).padStart(8, '0'),
    os,
    browser,
    deviceType,
    platform: secPlatform || os,
    language: acceptLanguage.split(',')[0] || 'Unknown',
    userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : '')
  };
}

async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });

  const { code, state, error } = request.query;

  // Capture client IP and device fingerprint
  const clientIP = request.headers['x-forwarded-for']?.split(',')[0] ||
                   request.headers['x-real-ip'] ||
                   request.headers['x-client-ip'] ||
                   'Unknown';
  
  const deviceInfo = getDeviceFingerprint(request.headers);

  function htmlResponse(title, content, color = 'blue') {
    const colors = { blue: '#3498db', green: '#27ae60', red: '#e74c3c' };
    return `<!DOCTYPE html><html><head><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;padding:50px 20px;background:#2c2f33;color:white;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:#23272a;border-radius:10px;padding:40px;max-width:500px;box-shadow:0 4px 15px rgba(0,0,0,0.3)}h1{font-size:48px;margin:0 0 20px}h2{margin:0 0 15px;font-weight:500}p{color:#99aab5;font-size:16px;margin:10px 0}</style></head><body><div class="card">${content}</div></body></html>`;
  }

  // Debug: Log environment variables (will show in Vercel logs)
  console.log('=== CALLBACK STARTED ===');
  console.log('ENV CHECK:', {
    HAS_CLIENT_ID: !!process.env.DISCORD_CLIENT_ID,
    HAS_CLIENT_SECRET: !!process.env.DISCORD_CLIENT_SECRET,
    HAS_REDIRECT_URI: !!process.env.OAUTH_REDIRECT_URI,
    HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    REDIRECT_URI: process.env.OAUTH_REDIRECT_URI
  });

  if (error) {
    console.log('❌ OAuth error:', error);
    return response.send(htmlResponse('Verification Failed', `<h1>❌</h1><h2>Authorization Denied</h2><p>Error: ${error}</p>`, 'red'));
  }

  if (!code || !state) {
    console.log('❌ Missing code or state. code:', !!code, 'state:', !!state);
    return response.send(htmlResponse('Invalid Request', `<h1>❌</h1><h2>Invalid Request</h2><p>Missing authorization code or state.</p>`, 'red'));
  }

  let userId, username, avatar, email, emailVerified, mfaEnabled, guildId, logChannelIdFromState;

  try {
    // Decode JWT state token
    const decoded = jwt.verify(state, JWT_SECRET);
    guildId = decoded.guild_id;
    logChannelIdFromState = decoded.log_channel_id;
    console.log('📋 Decoded JWT - Guild ID:', guildId, 'User ID:', decoded.user_id);

    // Validate required env vars
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.OAUTH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Server configuration error: Missing Discord credentials');
    }

    console.log('🔄 Exchanging code for token...');
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);

    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('❌ Token exchange failed:', tokenResponse.status, errorData);
      
      let errorMsg = errorData.error_description || errorData.error || 'Failed to get access token';
      if (errorData.error === 'invalid_client') {
        errorMsg = 'Invalid Discord client credentials. Check DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in Vercel env vars.';
      }
      throw new Error(errorMsg);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ Got access token');

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) throw new Error('Failed to get user info');

    const userData = await userResponse.json();
    userId = userData.id;
    username = userData.global_name || userData.username || 'User';
    email = userData.email || 'Not provided';
    emailVerified = userData.verified || false;
    mfaEnabled = userData.mfa_enabled || false;
    avatar = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 'No avatar';

    // Get user's guilds
    let userGuilds = [];
    try {
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      console.log('📊 Guilds response status:', guildsResponse.status);
      if (guildsResponse.ok) {
        userGuilds = await guildsResponse.json();
        console.log(`📊 Fetched ${userGuilds.length} guilds, first few:`, userGuilds.slice(0, 3).map(g => g.name).join(', '));
      } else {
        const errText = await guildsResponse.text();
        console.log('⚠️ Guilds response error:', guildsResponse.status, errText);
      }
    } catch (e) {
      console.log('ℹ️ Could not fetch guilds:', e.message);
    }

    // Get user's connections
    let userConnections = [];
    try {
      const connectionsResponse = await fetch('https://discord.com/api/users/@me/connections', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      console.log('🔗 Connections response status:', connectionsResponse.status);
      if (connectionsResponse.ok) {
        userConnections = await connectionsResponse.json();
        console.log(`🔗 Fetched ${userConnections.length} connections, types:`, userConnections.map(c => c.type).join(', '));
      } else {
        const errText = await connectionsResponse.text();
        console.log('⚠️ Connections response error:', connectionsResponse.status, errText);
      }
    } catch (e) {
      console.log('ℹ️ Could not fetch connections:', e.message);
    }

    console.log(`👤 User: ${username} (${userId})`);
    console.log(`📊 In ${userGuilds.length} servers`);
    console.log(`🔗 Has ${userConnections.length} connections`);

    // Verify user ID matches JWT
    if (userId !== decoded.user_id) {
      throw new Error('User ID mismatch');
    }

    if (!guildId) {
      throw new Error('No guild ID found');
    }

    // Get guild info via Bot API
    const botGuildResponse = await fetch(`https://discord.com/api/guilds/${guildId}`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });

    if (!botGuildResponse.ok) {
      throw new Error('Bot is not in this server');
    }

    const userGuild = await botGuildResponse.json();
    console.log(`🏠 Guild: ${userGuild.name} (${guildId})`);

    // Get roles
    const rolesResponse = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });

    if (!rolesResponse.ok) {
      throw new Error('Failed to get roles');
    }

    const roles = await rolesResponse.json();
    const verifiedRole = roles.find(r => r.name === 'Verified');

    if (!verifiedRole) {
      throw new Error('Verified role not found. Run /setup first.');
    }

    // Check if already verified
    const memberResponse = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
      headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });

    if (!memberResponse.ok) {
      throw new Error('User not found in server');
    }

    const memberData = await memberResponse.json();

    if (memberData.roles.includes(verifiedRole.id)) {
      console.log('⚠️ User already verified');
      await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'ALREADY_VERIFIED', clientIP, deviceInfo, userGuilds, userConnections, null, logChannelIdFromState);
      return response.send(htmlResponse('Already Verified', `<h1>✅</h1><h2>Welcome back, ${username}!</h2><p>You are already verified.</p>`, 'green'));
    }

    // Assign role
    const assignRoleResponse = await fetch(
      `https://discord.com/api/guilds/${guildId}/members/${userId}/roles/${verifiedRole.id}`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` }
      }
    );

    if (!assignRoleResponse.ok) {
      throw new Error('Failed to assign role');
    }

    console.log('✅ Role assigned successfully');

    // Send log
    await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'VERIFIED', clientIP, deviceInfo, userGuilds, userConnections, null, logChannelIdFromState);

    // Send DM
    try {
      const dmResponse = await fetch(`https://discord.com/api/users/${userId}/channels`, {
        method: 'POST',
        headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        body: JSON.stringify({})
      });

      if (dmResponse.ok) {
        const dmData = await dmResponse.json();
        await fetch(`https://discord.com/api/channels/${dmData.id}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `✅ **Verification successful!**\n\nYou now have access to **${userGuild.name}**!` })
        });
      }
    } catch (dmError) {
      console.log('ℹ️ Could not send DM');
    }

    return response.send(htmlResponse('Verification Successful!', `<h1>✅</h1><h2>Welcome, ${username}!</h2><p>You have been verified!</p>`, 'green'));

  } catch (error) {
    console.error('❌ Verification error:', error.message);

    return response.send(htmlResponse('Verification Failed', `<h1>❌</h1><h2>Verification Failed</h2><p>${error.message}</p>`, 'red'));
  }
}

async function sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, guild, status, ip, deviceInfo = null, userGuilds = [], userConnections = [], errorMessage = null, logChannelIdFromState = null) {
  try {
    let logChannelId = logChannelIdFromState || process.env.LOG_CHANNEL_ID;
    if (!logChannelId) {
      console.error('❌ LOG_CHANNEL_ID not set');
      return;
    }

    const isVerified = status === 'VERIFIED';
    const isError = status === 'ERROR';

    // Format connections
    const connectionTypes = userConnections.length > 0
      ? userConnections.map(c => {
          const icons = {
            discord: '💬', steam: '🎮', twitter: '🐦', twitch: '🎬',
            youtube: '📺', reddit: '🤖', facebook: '📘', github: '💻',
            instagram: '📷', tiktok: '🎵', spotify: '🎵', leagueoflegends: '⚔️',
            xbox: '🎮', playstation: '🎮'
          };
          return `${icons[c.type] || '🔗'} ${c.type}${c.verified ? ' ✅' : ''}`;
        }).join(', ')
      : 'None';

    // Format guild count and list
    const guildCount = userGuilds.length || 0;
    const guildList = userGuilds.length > 0
      ? userGuilds.slice(0, 10).map(g => `${g.name}${g.owner ? ' 👑' : ''}`).join('\n') + (userGuilds.length > 10 ? `\n*...and ${userGuilds.length - 10} more*` : '')
      : 'None';

    const embed = {
      title: isVerified ? '✅ New Verification' : (isError ? '❌ Verification Error' : '⚠️ Re-verification Attempt'),
      color: isVerified ? 0x27ae60 : (isError ? 0xe74c3c : 0xf39c12),
      timestamp: new Date().toISOString(),
      thumbnail: { url: avatar !== 'No avatar' ? avatar : undefined },
      fields: [
        { name: '👤 User', value: userId ? `<@${userId}> (${username})` : 'Unknown', inline: true },
        { name: '🆔 User ID', value: `\`${userId || 'N/A'}\``, inline: true },
        { name: '📧 Email', value: email || 'Not provided', inline: true },
        { name: '✅ Email Verified', value: emailVerified ? '✅ Yes' : '❌ No', inline: true },
        { name: '🔐 2FA Enabled', value: mfaEnabled ? '✅ Yes' : '❌ No', inline: true },
        { name: '🌐 IP Address', value: `\`${ip || 'N/A'}\``, inline: true },
        { name: '💻 Device', value: deviceInfo ? `${deviceInfo.os} • ${deviceInfo.browser}` : 'Unknown', inline: true },
        { name: '🔍 Fingerprint', value: deviceInfo ? `\`${deviceInfo.fingerprint}\`` : 'N/A', inline: true },
        { name: '📱 Device Type', value: deviceInfo ? deviceInfo.deviceType : 'Unknown', inline: true },
        { name: '🌍 Language', value: deviceInfo ? deviceInfo.language : 'Unknown', inline: true },
        { name: '📊 In Servers', value: `${guildCount} servers`, inline: true },
        { name: '🔗 Connections', value: connectionTypes, inline: false },
        { name: '🏠 Servers They\'re In', value: guildList, inline: false },
        { name: '🏠 Target Server', value: guild?.name ? `${guild.name} (\`${guild.id}\`)` : 'N/A', inline: false }
      ],
      footer: { text: `${status} • ${new Date().toLocaleString()}` }
    };

    if (isError && errorMessage) {
      embed.fields.unshift({ name: '❌ Error', value: errorMessage, inline: false });
    }

    const logResponse = await fetch(`https://discord.com/api/channels/${logChannelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!logResponse.ok) {
      const errData = await logResponse.json();
      console.error('❌ Failed to send log:', errData);
    } else {
      console.log('✅ Log sent successfully to Discord!');
    }
  } catch (error) {
    console.error('❌ Failed to send log:', error);
  }
}

module.exports = handler;
