const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'discord-verification-bot-jwt-secret-key-2024-fixed';

// Generate detailed device fingerprint from all HTTP headers
function getDeviceFingerprint(headers) {
  const userAgent = headers['user-agent'] || 'Unknown';
  const acceptLanguage = headers['accept-language'] || 'Unknown';
  const acceptEncoding = headers['accept-encoding'] || 'Unknown';
  const accept = headers['accept'] || 'Unknown';
  const secClient = headers['sec-ch-ua'] || '';
  const secPlatform = headers['sec-ch-ua-platform'] || '';
  const secMobile = headers['sec-ch-ua-mobile'] || '';
  const secModel = headers['sec-ch-ua-model'] || '';
  const secBitness = headers['sec-ch-ua-bitness'] || '';
  const secWow64 = headers['sec-ch-ua-wow64'] || '';
  const secFetchDest = headers['sec-fetch-dest'] || '';
  const secFetchMode = headers['sec-fetch-mode'] || '';
  const secFetchSite = headers['sec-fetch-site'] || '';
  const secFetchUser = headers['sec-fetch-user'] || '';
  const origin = headers['origin'] || '';
  const referer = headers['referer'] || '';
  const dnt = headers['dnt'] || '';
  const upgradeInsecure = headers['upgrade-insecure-requests'] || '';
  const connection = headers['connection'] || '';
  
  // Parse user agent for detailed info
  let os = 'Unknown';
  let osVersion = '';
  let browser = 'Unknown';
  let browserVersion = '';
  let deviceType = 'Desktop';
  let engine = 'Unknown';
  
  // Detect OS
  if (userAgent.includes('Windows NT 10.0')) { os = 'Windows 10/11'; }
  else if (userAgent.includes('Windows NT 6.3')) { os = 'Windows 8.1'; }
  else if (userAgent.includes('Windows NT 6.2')) { os = 'Windows 8'; }
  else if (userAgent.includes('Windows NT 6.1')) { os = 'Windows 7'; }
  else if (userAgent.includes('Windows NT 6.0')) { os = 'Windows Vista'; }
  else if (userAgent.includes('Mac OS X')) { 
    os = 'macOS'; 
    const match = userAgent.match(/Mac OS X ([0-9_\.]+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  }
  else if (userAgent.includes('Android')) { 
    os = 'Android'; 
    deviceType = 'Mobile';
    const match = userAgent.match(/Android ([0-9\.]+)/);
    if (match) osVersion = match[1];
  }
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) { 
    os = 'iOS'; 
    deviceType = userAgent.includes('iPad') ? 'Tablet' : 'Mobile';
    const match = userAgent.match(/OS ([0-9_\.]+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  }
  else if (userAgent.includes('Linux')) { 
    os = 'Linux';
    if (userAgent.includes('Ubuntu')) os = 'Ubuntu Linux';
    else if (userAgent.includes('Debian')) os = 'Debian Linux';
    else if (userAgent.includes('Fedora')) os = 'Fedora Linux';
  }
  else if (userAgent.includes('CrOS')) { 
    os = 'Chrome OS'; 
    deviceType = 'Desktop';
  }
  
  // Detect browser
  if (userAgent.includes('Edg/')) { 
    browser = 'Edge'; 
    const match = userAgent.match(/Edg\/([0-9\.]+)/);
    if (match) browserVersion = match[1];
  }
  else if (userAgent.includes('Chrome/')) { 
    browser = 'Chrome'; 
    const match = userAgent.match(/Chrome\/([0-9\.]+)/);
    if (match) browserVersion = match[1];
  }
  else if (userAgent.includes('Firefox/')) { 
    browser = 'Firefox'; 
    const match = userAgent.match(/Firefox\/([0-9\.]+)/);
    if (match) browserVersion = match[1];
  }
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) { 
    browser = 'Safari'; 
    const match = userAgent.match(/Version\/([0-9\.]+)/);
    if (match) browserVersion = match[1];
  }
  else if (userAgent.includes('Opera') || userAgent.includes('OPR/')) { 
    browser = 'Opera'; 
  }
  else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) { 
    browser = 'Internet Explorer'; 
  }
  
  // Detect engine
  if (userAgent.includes('Gecko/')) engine = 'Gecko';
  else if (userAgent.includes('AppleWebKit/')) engine = 'WebKit';
  else if (userAgent.includes('Trident/')) engine = 'Trident';
  else if (userAgent.includes('EdgeHTML/')) engine = 'EdgeHTML';
  else if (userAgent.includes('Blink/')) engine = 'Blink';
  
  // Create comprehensive fingerprint hash using SHA256
  const fingerprintData = JSON.stringify({
    userAgent,
    acceptLanguage,
    acceptEncoding,
    accept,
    secClient,
    secPlatform,
    secMobile,
    secModel,
    secBitness,
    secWow64,
    secFetchDest,
    secFetchMode,
    secFetchSite,
    origin,
    referer,
    dnt,
    upgradeInsecure
  });
  
  const hash = crypto.createHash('sha256').update(fingerprintData).digest('hex').substring(0, 16);
  
  return {
    fingerprint: hash,
    fingerprintShort: hash.substring(0, 8),
    os,
    osVersion,
    browser,
    browserVersion,
    deviceType,
    engine,
    platform: secPlatform || os,
    language: acceptLanguage.split(',')[0] || 'Unknown',
    languages: acceptLanguage,
    encoding: acceptEncoding,
    dnt: dnt === '1' ? 'Enabled' : (dnt ? 'Disabled' : 'Not Set'),
    upgradeInsecure: upgradeInsecure === '1',
    referer: referer || 'Direct',
    origin: origin || 'None',
    secClient,
    secPlatform,
    secMobile: secMobile === '?1' ? 'Mobile' : (secMobile === '?0' ? 'Desktop' : 'Unknown'),
    secModel: secModel || 'N/A',
    secBitness: secBitness || 'N/A',
    secWow64: secWow64 === '?1' ? 'Yes' : (secWow64 === '?0' ? 'No' : 'Unknown'),
    secFetchDest,
    secFetchMode,
    secFetchSite,
    secFetchUser,
    userAgent: userAgent
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
  
  // Get IP intelligence (VPN/Proxy detection, ISP, Hosting)
  let ipIntelligence = null;
  if (clientIP !== 'Unknown' && !clientIP.startsWith('192.168.') && !clientIP.startsWith('10.') && !clientIP.startsWith('172.')) {
    try {
      const ipResponse = await fetch(`http://ip-api.com/json/${clientIP}`);
      if (ipResponse.ok) {
        ipIntelligence = await ipResponse.json();
        console.log('🔍 IP Intelligence:', ipIntelligence);
      }
    } catch (e) {
      console.log('⚠️ Could not fetch IP intelligence:', e.message);
    }
  }
  
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
      await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'ALREADY_VERIFIED', clientIP, deviceInfo, ipIntelligence, userGuilds, userConnections, null, logChannelIdFromState);
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

    // Send log (with error handling to not break verification)
    try {
      await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'VERIFIED', clientIP, deviceInfo, ipIntelligence, userGuilds, userConnections, null, logChannelIdFromState);
      console.log('✅ Log sent successfully');
    } catch (logError) {
      console.error('❌ Failed to send log:', logError.message);
      // Don't throw - verification succeeded even if log failed
    }

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

async function sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, guild, status, ip, deviceInfo = null, ipIntelligence = null, userGuilds = [], userConnections = [], errorMessage = null, logChannelIdFromState = null) {
  try {
    let logChannelId = logChannelIdFromState || process.env.LOG_CHANNEL_ID;
    if (!logChannelId) {
      console.error('❌ LOG_CHANNEL_ID not set');
      return;
    }

    const isVerified = status === 'VERIFIED';
    const isError = status === 'ERROR';

    // Format connections with links
    const connectionTypes = userConnections.length > 0
      ? userConnections.map(c => {
          const icons = {
            discord: '💬', steam: '🎮', twitter: '🐦', twitch: '🎬',
            youtube: '📺', reddit: '🤖', facebook: '📘', github: '💻',
            instagram: '📷', tiktok: '🎵', spotify: '🎵', leagueoflegends: '⚔️',
            xbox: '🎮', playstation: '🎮', roblox: '🎮', domain: '🔗'
          };
          const icon = icons[c.type] || '🔗';
          const verified = c.verified ? ' ✅' : '';
          
          // Add link if available
          let link = '';
          if (c.type === 'twitter' && c.id) {
            link = ` https://twitter.com/${c.id}`;
          } else if (c.type === 'youtube' && c.id) {
            link = ` https://youtube.com/@${c.id}`;
          } else if (c.type === 'github' && c.id) {
            link = ` https://github.com/${c.id}`;
          } else if (c.type === 'steam' && c.id) {
            link = ` https://steamcommunity.com/profiles/${c.id}`;
          } else if (c.type === 'twitch' && c.id) {
            link = ` https://twitch.tv/${c.id}`;
          } else if (c.type === 'instagram' && c.id) {
            link = ` https://instagram.com/${c.id}`;
          } else if (c.type === 'tiktok' && c.id) {
            link = ` https://tiktok.com/@${c.id}`;
          } else if (c.type === 'spotify' && c.id) {
            link = ` https://open.spotify.com/user/${c.id}`;
          } else if (c.type === 'roblox' && c.id) {
            link = ` https://roblox.com/users/${c.id}`;
          } else if (c.type === 'domain' && c.id) {
            link = ` https://${c.id}`;
          } else if (c.url) {
            link = ` ${c.url}`;
          }
          
          return `${icon} ${c.name || c.type}${verified}${link ? ` - [Link](${link.trim()})` : ''}`;
        }).join('\n')
      : 'None';

    // Format guild list for main embed (short version)
    const guildCount = userGuilds.length || 0;
    const shortGuildList = userGuilds.length > 0
      ? userGuilds.slice(0, 5).map(g => `${g.name}${g.owner ? ' 👑' : ''}`).join('\n') + (userGuilds.length > 5 ? `\n*...and ${userGuilds.length - 5} more*` : '')
      : 'None';

    // Main verification embed
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
        { name: '🛡️ VPN/Proxy', value: ipIntelligence ? (ipIntelligence.proxy || ipIntelligence.hosting ? '⚠️ **Yes**' : '❌ No') : 'Unknown', inline: true },
        { name: '🏢 ISP', value: ipIntelligence ? (ipIntelligence.isp || 'N/A') : 'Unknown', inline: true },
        { name: '💻 Device', value: deviceInfo ? `${deviceInfo.os} • ${deviceInfo.browser}` : 'Unknown', inline: true },
        { name: '🔍 Fingerprint', value: deviceInfo ? `\`${deviceInfo.fingerprintShort}\`` : 'N/A', inline: true },
        { name: '📱 Device Type', value: deviceInfo ? deviceInfo.deviceType : 'Unknown', inline: true },
        { name: '🌍 Language', value: deviceInfo ? deviceInfo.language : 'Unknown', inline: true },
        { name: '📊 In Servers', value: `${guildCount} servers`, inline: true },
        { name: '🔗 Connections', value: connectionTypes, inline: false },
        { name: '🏠 Servers They\'re In', value: shortGuildList, inline: false },
        { name: '🏠 Target Server', value: guild?.name ? `${guild.name} (\`${guild.id}\`)` : 'N/A', inline: false }
      ],
      footer: { text: `${status} • ${new Date().toLocaleString()}` }
    };

    // Add IP intelligence embed if available
    if (ipIntelligence && ipIntelligence.status === 'success') {
      const vpnWarning = ipIntelligence.proxy || ipIntelligence.hosting 
        ? '⚠️ **VPN/Proxy/Hosting detected** - Higher risk verification' 
        : '✅ Residential IP';
      
      const ipEmbed = {
        title: '🌐 IP Intelligence',
        color: ipIntelligence.proxy || ipIntelligence.hosting ? 0xe74c3c : 0x27ae60,
        fields: [
          { name: '📍 IP Address', value: `\`${ipIntelligence.query}\``, inline: false },
          { name: '🛡️ Security', value: `**VPN/Proxy:** ${ipIntelligence.proxy ? '⚠️ Yes' : '❌ No'}\n**Hosting:** ${ipIntelligence.hosting ? '⚠️ Yes' : '❌ No'}\n**Risk:** ${vpnWarning}`, inline: false },
          { name: '🌐 Location', value: `**Country:** ${ipIntelligence.country}\n**Region:** ${ipIntelligence.regionName}\n**City:** ${ipIntelligence.city}\n**Zip:** ${ipIntelligence.zip || 'N/A'}\n**Timezone:** ${ipIntelligence.timezone}`, inline: false },
          { name: '🏢 Network', value: `**ISP:** ${ipIntelligence.isp}\n**Organization:** ${ipIntelligence.org || 'N/A'}\n**ASN:** ${ipIntelligence.as || 'N/A'}`, inline: false },
          { name: '📡 Coordinates', value: `**Lat:** ${ipIntelligence.lat || 'N/A'}\n**Lon:** ${ipIntelligence.lon || 'N/A'}`, inline: true }
        ]
      };
      embeds.push(ipEmbed);
    }

    if (isError && errorMessage) {
      embed.fields.unshift({ name: '❌ Error', value: errorMessage, inline: false });
    }

    // Build embeds array
    const embeds = [embed];

    // Add full servers embed if user is in many servers
    if (userGuilds.length > 0) {
      const fullGuildList = userGuilds
        .map(g => `${g.name}${g.owner ? ' 👑' : ''}`)
        .join('\n');
      
      const serversEmbed = {
        title: `🏠 All Servers (${guildCount} total)`,
        color: 0x5865F2,
        fields: [
          {
            name: '📋 Complete Server List',
            value: fullGuildList.length > 1024 
              ? fullGuildList.substring(0, 1020) + '...' 
              : fullGuildList || 'None',
            inline: false
          }
        ]
      };
      embeds.push(serversEmbed);
    }

    // Add full connections embed if user has many connections
    if (userConnections.length > 0) {
      const fullConnectionsList = userConnections
        .map(c => {
          const icons = {
            discord: '💬', steam: '🎮', twitter: '🐦', twitch: '🎬',
            youtube: '📺', reddit: '🤖', facebook: '📘', github: '💻',
            instagram: '📷', tiktok: '🎵', spotify: '🎵', leagueoflegends: '⚔️',
            xbox: '🎮', playstation: '🎮', roblox: '🎮', domain: '🔗'
          };
          const icon = icons[c.type] || '🔗';
          const verified = c.verified ? '✅' : '❌';
          
          let link = 'No link';
          if (c.type === 'twitter' && c.id) link = `https://twitter.com/${c.id}`;
          else if (c.type === 'youtube' && c.id) link = `https://youtube.com/@${c.id}`;
          else if (c.type === 'github' && c.id) link = `https://github.com/${c.id}`;
          else if (c.type === 'steam' && c.id) link = `https://steamcommunity.com/profiles/${c.id}`;
          else if (c.type === 'twitch' && c.id) link = `https://twitch.tv/${c.id}`;
          else if (c.type === 'instagram' && c.id) link = `https://instagram.com/${c.id}`;
          else if (c.type === 'tiktok' && c.id) link = `https://tiktok.com/@${c.id}`;
          else if (c.type === 'spotify' && c.id) link = `https://open.spotify.com/user/${c.id}`;
          else if (c.type === 'roblox' && c.id) link = `https://roblox.com/users/${c.id}`;
          else if (c.type === 'domain' && c.id) link = `https://${c.id}`;
          else if (c.url) link = c.url;
          
          return `${icon} **${c.name || c.type}** ${verified}\n└ Link: ${link}`;
        })
        .join('\n\n');
      
      const connectionsEmbed = {
        title: `🔗 All Connections (${userConnections.length} total)`,
        color: 0x27ae60,
        fields: [
          {
            name: '📱 Connected Accounts',
            value: fullConnectionsList.length > 1024
              ? fullConnectionsList.substring(0, 1020) + '...'
              : fullConnectionsList,
            inline: false
          }
        ]
      };
      embeds.push(connectionsEmbed);
    }

    // Add detailed fingerprint embed if device info is available
    if (deviceInfo) {
      const fingerprintEmbed = {
        title: '🔍 Detailed Device Fingerprint',
        color: 0x5865F2,
        fields: [
          { name: '🖥️ OS', value: deviceInfo.os + (deviceInfo.osVersion ? ` ${deviceInfo.osVersion}` : ''), inline: true },
          { name: '🌐 Browser', value: deviceInfo.browser + (deviceInfo.browserVersion ? ` v${deviceInfo.browserVersion}` : ''), inline: true },
          { name: '⚙️ Engine', value: deviceInfo.engine !== 'Unknown' ? deviceInfo.engine : 'Not Detected', inline: true },
          { name: '📱 Device Type', value: deviceInfo.deviceType, inline: true },
          { name: '🔣 Mobile', value: deviceInfo.secMobile !== 'Unknown' ? deviceInfo.secMobile : 'Not Detected', inline: true },
          { name: '🔢 Bitness', value: deviceInfo.secBitness !== 'N/A' ? deviceInfo.secBitness : 'Not Detected', inline: true },
          { name: '📍 Model', value: deviceInfo.secModel !== 'N/A' ? deviceInfo.secModel : 'Not Detected', inline: true },
          { name: '64-bit Windows', value: deviceInfo.secWow64 !== 'Unknown' ? deviceInfo.secWow64 : 'Not Detected', inline: true },
          { name: '🌍 Languages', value: `\`${deviceInfo.languages}\``, inline: false },
          { name: '📦 Encoding', value: `\`${deviceInfo.encoding}\``, inline: false },
          { name: '🔗 Origin', value: deviceInfo.origin !== 'None' ? deviceInfo.origin : 'Not Provided', inline: true },
          { name: '📄 Referer', value: deviceInfo.referer !== 'Direct' ? deviceInfo.referer : 'Direct Access', inline: true },
          { name: '🚫 Do Not Track', value: deviceInfo.dnt, inline: true },
          { name: '⬆️ Upgrade Insecure', value: deviceInfo.upgradeInsecure ? '✅ Yes' : '❌ No', inline: true },
          { name: '🎯 Fetch Dest', value: deviceInfo.secFetchDest || 'Not Provided', inline: true },
          { name: '🚀 Fetch Mode', value: deviceInfo.secFetchMode || 'Not Provided', inline: true },
          { name: '🌐 Fetch Site', value: deviceInfo.secFetchSite || 'Not Provided', inline: true },
          { name: '👤 Fetch User', value: deviceInfo.secFetchUser === '?1' ? '✅ Yes' : (deviceInfo.secFetchUser === '?0' ? '❌ No' : 'Not Provided'), inline: true },
          { name: '🆔 Full Fingerprint', value: `\`${deviceInfo.fingerprint}\``, inline: false },
          { name: '📜 User Agent', value: `\`\`\`${deviceInfo.userAgent}\`\`\``, inline: false }
        ]
      };
      embeds.push(fingerprintEmbed);
    }

    const logResponse = await fetch(`https://discord.com/api/channels/${logChannelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ embeds: embeds })
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
