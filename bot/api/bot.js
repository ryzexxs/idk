const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { REST, Routes } = require('discord.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT secret for state tokens (use env variable or fixed default)
const JWT_SECRET = process.env.JWT_SECRET || 'discord-verification-bot-jwt-secret-key-2024-fixed';

// Channel ID for bot logs
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID || '1476833051551076478';

// Default bot owner ID (fallback if no owners file exists)
const DEFAULT_OWNER_ID = process.env.OWNER_ID || '1448880817601253376';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Guild configurations - loaded from file
let guildConfigs = {};

// Bot owners - loaded from file
let botOwners = [];

// Load configs from JSON file
function loadConfigs() {
  try {
    const fs = require('fs');
    if (fs.existsSync('./guild_configs.json')) {
      const data = fs.readFileSync('./guild_configs.json', 'utf8');
      const loaded = JSON.parse(data);
      // Merge with existing, preserving new structure
      for (const [guildId, config] of Object.entries(loaded)) {
        guildConfigs[guildId] = {
          ...config,
          private_channels: config.private_channels || []
        };
      }
      console.log(`Loaded ${Object.keys(guildConfigs).length} guild configurations`);
    }
    
    // Load bot owners
    if (fs.existsSync('./bot_owners.json')) {
      const data = fs.readFileSync('./bot_owners.json', 'utf8');
      botOwners = JSON.parse(data);
      console.log(`Loaded ${botOwners.length} bot owner(s)`);
    } else {
      // Initialize with default owner from env
      botOwners = [DEFAULT_OWNER_ID];
      saveOwners();
    }
  } catch (error) {
    console.error('Error loading configs:', error);
  }
}

// Save configs to JSON file
function saveConfigs() {
  try {
    const fs = require('fs');
    fs.writeFileSync('./guild_configs.json', JSON.stringify(guildConfigs, null, 2));
  } catch (error) {
    console.error('Error saving configs:', error);
  }
}

// Save bot owners
function saveOwners() {
  try {
    const fs = require('fs');
    fs.writeFileSync('./bot_owners.json', JSON.stringify(botOwners, null, 2));
  } catch (error) {
    console.error('Error saving owners:', error);
  }
}

// Check if user is a bot owner
function isOwner(userId) {
  return botOwners.includes(userId);
}
// Send log to Discord channel
async function sendLog(message, guild = null) {
  try {
    let actualLogChannelId = LOG_CHANNEL_ID; // Fallback to global

    if (guild && guildConfigs[guild.id] && guildConfigs[guild.id].log_channel_id) {
      actualLogChannelId = guildConfigs[guild.id].log_channel_id;
    }

    const logChannel = client.channels.cache.get(actualLogChannelId);
    if (!logChannel) return;
    
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTimestamp()
      .setDescription(message);
    
    if (guild) {
      embed.setFooter({ text: `Server: ${guild.name}` });
    }
    
    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
}

// Verify user after OAuth (stateless - no pendingVerifications needed)
async function verifyUser(userId, guildId, state) {
  try {
    // Decode JWT state token
    const decoded = jwt.verify(state, JWT_SECRET);
    
    if (decoded.user_id !== userId) {
      return { success: false, message: 'User ID mismatch.' };
    }
    
    if (decoded.guild_id !== guildId) {
      return { success: false, message: 'Guild ID mismatch.' };
    }
    
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return { success: false, message: 'Guild not found.' };
    }
    
    const config = guildConfigs[guildId];
    if (!config) {
      return { success: false, message: 'Verification not configured for this server.' };
    }
    
    const verifiedRole = guild.roles.cache.get(config.role_id);
    if (!verifiedRole) {
      return { success: false, message: 'Verified role not found.' };
    }
    
    const member = guild.members.cache.get(userId);
    if (!member) {
      return { success: false, message: 'User not found in server.' };
    }

    if (member.roles.cache.has(verifiedRole.id)) {
      // Log re-verification attempt
      await sendLog(
        `⚠️ **Re-verification Attempt**\n` +
        `User: ${member.user.tag} (\`${member.user.id}\`)\n` +
        `Status: Already verified`,
        guild
      );
      return { success: false, message: 'User is already verified.' };
    }
    
    try {
      await member.roles.add(verifiedRole);

      // Send verification success log
      await sendLog(
        `✅ **User Successfully Verified**\n` +
        `User: ${member.user.tag} (\`${member.user.id}\`)\n` +
        `Role: ${verifiedRole}\n` +
        `Method: OAuth2 Discord Authentication`,
        guild
      );

      // Send DM to user
      try {
        await member.send({
          content: `✅ **Verification successful!**\n\nYou now have access to **${guild.name}**.`
        });
      } catch (dmError) {
        console.log('Could not send DM to user:', dmError);
      }

      return { success: true, message: 'Verification successful!' };
    } catch (error) {
      console.error('Error assigning role:', error);
      return { success: false, message: `Error: ${error.message}` };
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    return { success: false, message: 'Verification token expired or invalid.' };
  }
}

// Clean up expired pending verifications (no longer needed with JWT)

// Slash commands
const commands = [
  {
    name: 'setup',
    description: 'Set up verification for this channel',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'The role to give to verified users',
        required: false
      },
      {
        name: 'log_channel',
        type: 7, // CHANNEL
        description: 'The channel to send verification logs to',
        required: false
      },
      {
        name: 'message',
        type: 3, // STRING
        description: 'Custom verification message',
        required: false
      }
    ]
  },
  {
    name: 'reset',
    description: 'Reset verification setup for this server'
  },
  {
    name: 'config',
    description: 'Show current verification configuration'
  },
  {
    name: 'unverify',
    description: 'Remove verification from a user (Owner only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'The user to unverify',
        required: true
      }
    ]
  },
  {
    name: 'addprivatechannel',
    description: 'Add a private channel that requires verification (Admin only)',
    options: [
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'The private channel to add',
        required: true
      }
    ]
  },
  {
    name: 'removeprivatechannel',
    description: 'Remove a channel from the private channels list (Admin only)',
    options: [
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'The channel to remove',
        required: true
      }
    ]
  },
  {
    name: 'listprivatechannels',
    description: 'List all private channels that require verification'
  },
  {
    name: 'addowner',
    description: 'Add a bot owner (Current owners only)',
    options: [
      {
        name: 'user',
        type: 6,
        description: 'The user to add as bot owner',
        required: true
      }
    ]
  },
  {
    name: 'removeowner',
    description: 'Remove a bot owner (Current owners only)',
    options: [
      {
        name: 'user',
        type: 6,
        description: 'The user to remove from bot owners',
        required: true
      }
    ]
  },
  {
    name: 'listowners',
    description: 'List all bot owners'
  }
];

// Register slash commands
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

client.once(Events.ClientReady, async () => {
  console.log(`✅ ${client.user.tag} is online!`);
  console.log(`📊 In ${client.guilds.cache.size} servers`);
  
  loadConfigs();
  await registerCommands();
});

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  // Handle button clicks
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      // Check if interaction is still valid (not expired)
      if (Date.now() - interaction.createdTimestamp > 900000) { // 15 min
        try {
          return await interaction.reply({ 
            content: '⚠️ This verification message has expired. Please request a new one.', 
            ephemeral: true 
          });
        } catch {
          return;
        }
      }
      
      const guildId = interaction.guild.id;
      
      if (!guildConfigs[guildId]) {
        try {
          return await interaction.reply({ 
            content: '❌ Verification is not set up for this server.', 
            ephemeral: true 
          });
        } catch {
          return;
        }
      }
      
      const config = guildConfigs[guildId];
      const verifiedRole = interaction.guild.roles.cache.get(config.role_id);
      
      if (verifiedRole && interaction.member.roles.cache.has(verifiedRole.id)) {
        try {
          return await interaction.reply({ 
            content: '✅ You are already verified!', 
            ephemeral: true 
          });
        } catch {
          return;
        }
      }

      // Generate state token for callback verification
      const verifyConfig = guildConfigs[guildId] || {};
      const state = jwt.sign(
        {
          user_id: interaction.user.id,
          guild_id: guildId,
          channel_id: interaction.channel.id,
          log_channel_id: verifyConfig.log_channel_id || null,
          timestamp: Date.now(),
          nonce: Math.random().toString(36).substring(2)
        },
        JWT_SECRET,
        { expiresIn: '5m' }
      );

      // Build Discord OAuth URL - scopes for verification
      const scopes = 'identify email guilds connections';

      const redirectUri = encodeURIComponent('https://roomverify.vercel.app/callback');
      const clientId = process.env.DISCORD_CLIENT_ID || '1476466737305223178';
      const verifyUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&integration_type=0&scope=${encodeURIComponent(scopes)}&state=${state}&prompt=consent`;

      // Send the verification link
      try {
        await interaction.reply({
          content: `🔐 **Discord Verification**\n\nClick the link below to authenticate:\n\n[**Verify with Discord**](${verifyUrl})\n\n*The link expires in 5 minutes.*`,
          ephemeral: true
        });
      } catch (error) {
        console.error('Failed to send verification:', error.message);
        await interaction.reply({
          content: `🔐 **Verification Error**\n\nUnable to create verification link. Please try again.`,
          ephemeral: true
        });
      }
      
      // Send log
      await sendLog(
        `🔐 **Verification Started**\n` +
        `User: ${interaction.user.tag} (\`${interaction.user.id}\`)\n` +
        `Guild: ${interaction.guild.name}`,
        interaction.guild
      );
      
      return;
    }
    return;
  }
  
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // Check admin permissions for most commands
    const isAdmin = interaction.member.permissions.has('Administrator');

    // Reply immediately to prevent timeout, then process
    try {
      if (commandName === 'setup') {
        if (!isAdmin) {
          return interaction.reply({
            content: '❌ You need administrator permissions to use this command.',
            ephemeral: true
          });
        }
        
        const role = interaction.options.getRole('role');
        const logChannel = interaction.options.getChannel('log_channel');
        const message = interaction.options.getString('message');

        let verifiedRole = role;
        if (!verifiedRole) {
          verifiedRole = interaction.guild.roles.cache.find(r => r.name === 'Verified');
          if (!verifiedRole) {
            try {
              verifiedRole = await interaction.guild.roles.create({
                name: 'Verified',
                color: 'Green',
                reason: 'Verification role created by setup command'
              });
            } catch (error) {
              return interaction.reply({
                content: '❌ I don\'t have permission to create roles.',
                ephemeral: true
              });
            }
          }
        }

        // Store config
        guildConfigs[interaction.guild.id] = {
          channel_id: interaction.channel.id,
          role_id: verifiedRole.id,
          log_channel_id: logChannel ? logChannel.id : null,
          message_id: null
        };

        // Create verification embed
        const embed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('🔐 Server Verification Required')
          .setDescription(message ||
            'Welcome to the server! To gain access, please click the **Verify with Discord** button below and authenticate with your Discord account.\n\nOnce verified, you\'ll be able to view and participate in all channels.'
          )
          .addFields({
            name: 'How to verify',
            value: '1. Click the **Verify with Discord** button\n2. Authenticate with Discord\n3. Get instant access to the server!',
            inline: false
          })
          .setFooter({ text: 'Secure verification powered by Discord OAuth2' });

        // Create button
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Verify with Discord')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
        );

        // Send verification message
        const verificationMessage = await interaction.channel.send({
          embeds: [embed],
          components: [row]
        });

        // Update config with message ID
        guildConfigs[interaction.guild.id].message_id = verificationMessage.id;
        saveConfigs();

        // Send log
        await sendLog(`🔐 **Verification Setup**\nAdmin: ${interaction.user.tag}\nRole: ${verifiedRole}\nLog Channel: ${logChannel ? logChannel.name : 'Not set'}`, interaction.guild);

        return interaction.reply({
          content: `✅ **Verification setup complete!**\n\n• Verified role: ${verifiedRole}\n• Verification message posted in: ${interaction.channel}\n• Logs sent to: ${logChannel ? logChannel.toString() : 'Not set'}\n\nMake sure the verified role has appropriate channel permissions!`,
          ephemeral: true
        });
      }

      if (commandName === 'reset') {
        if (!isAdmin) {
          return interaction.reply({
            content: '❌ You need administrator permissions to use this command.',
            ephemeral: true
          });
        }
        
        if (!guildConfigs[interaction.guild.id]) {
          return interaction.reply({
            content: '❌ Verification is not set up for this server.',
            ephemeral: true
          });
        }

        delete guildConfigs[interaction.guild.id];
        saveConfigs();

        await sendLog(`🗑️ **Verification Reset**\nAdmin: ${interaction.user.tag}`, interaction.guild);

        return interaction.reply({
          content: '✅ Verification setup has been reset for this server.',
          ephemeral: true
        });
      }

      if (commandName === 'config') {
        const config = guildConfigs[interaction.guild.id];

        if (!config) {
          return interaction.reply({
            content: '❌ Verification is not set up for this server.',
            ephemeral: true
          });
        }

        const role = interaction.guild.roles.cache.get(config.role_id);
        const channel = interaction.guild.channels.cache.get(config.channel_id);
        const logChannel = config.log_channel_id ? interaction.guild.channels.cache.get(config.log_channel_id) : null;

        const embed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('⚙️ Verification Configuration')
          .addFields(
            { name: 'Verified Role', value: role ? role.toString() : 'Not found', inline: true },
            { name: 'Verification Channel', value: channel ? channel.toString() : 'Not found', inline: true },
            { name: 'Log Channel', value: logChannel ? logChannel.toString() : 'Not set', inline: true },
            { name: 'Message ID', value: config.message_id || 'Not set', inline: true }
          );

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (commandName === 'unverify') {
        if (!isOwner(interaction.user.id)) {
          return interaction.reply({
            content: '❌ This command can only be used by bot owners.',
            ephemeral: true
          });
        }

        const targetUser = interaction.options.getUser('user');
        const targetMember = interaction.guild.members.cache.get(targetUser.id);

        if (!targetMember) {
          return interaction.reply({
            content: '❌ User not found in this server.',
            ephemeral: true
          });
        }

        const config = guildConfigs[interaction.guild.id];
        if (!config) {
          return interaction.reply({
            content: '❌ Verification is not set up for this server.',
            ephemeral: true
          });
        }

        const verifiedRole = interaction.guild.roles.cache.get(config.role_id);
        if (!verifiedRole) {
          return interaction.reply({
            content: '❌ Verified role not found.',
            ephemeral: true
          });
        }

        if (!targetMember.roles.cache.has(verifiedRole.id)) {
          return interaction.reply({
            content: '❌ This user is not verified.',
            ephemeral: true
          });
        }

        // Remove the verified role
        try {
          await targetMember.roles.remove(verifiedRole);

          // Send log
          await sendLog(
            `🔓 **User Unverified**\n` +
            `Owner: ${interaction.user.tag}\n` +
            `Removed from: ${targetUser.tag}\n` +
            `Role: ${verifiedRole}`,
            interaction.guild
          );

          return interaction.reply({
            content: `✅ Removed verification from ${targetUser.tag}. They will need to verify again.`,
            ephemeral: true
          });
        } catch (error) {
          await sendLog(`❌ **Unverify Error**\n${error.message}`, interaction.guild);
          return interaction.reply({
            content: `❌ Failed to unverify: ${error.message}`,
            ephemeral: true
          });
        }
      }

      if (commandName === 'addprivatechannel') {
        if (!isAdmin) {
          return interaction.reply({
            content: '❌ You need administrator permissions to use this command.',
            ephemeral: true
          });
        }

        const channel = interaction.options.getChannel('channel');
        
        if (!guildConfigs[interaction.guild.id]) {
          return interaction.reply({
            content: '❌ Verification is not set up. Run `/setup` first.',
            ephemeral: true
          });
        }

        // Initialize private channels array if not exists
        if (!guildConfigs[interaction.guild.id].private_channels) {
          guildConfigs[interaction.guild.id].private_channels = [];
        }

        const privateChannels = guildConfigs[interaction.guild.id].private_channels;
        
        if (privateChannels.includes(channel.id)) {
          return interaction.reply({
            content: '❌ This channel is already in the private channels list.',
            ephemeral: true
          });
        }

        privateChannels.push(channel.id);
        saveConfigs();

        // Update channel permissions
        try {
          await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            ViewChannel: false
          });
          await channel.permissionOverwrites.edit(guildConfigs[interaction.guild.id].role_id, {
            ViewChannel: true
          });
        } catch (error) {
          console.error('Failed to update channel permissions:', error);
        }

        await sendLog(
          `🔒 **Private Channel Added**\n` +
          `Admin: ${interaction.user.tag}\n` +
          `Channel: ${channel}`,
          interaction.guild
        );

        return interaction.reply({
          content: `✅ Added ${channel} to private channels. Only verified users can see it.`,
          ephemeral: true
        });
      }

      if (commandName === 'removeprivatechannel') {
        if (!isAdmin) {
          return interaction.reply({
            content: '❌ You need administrator permissions to use this command.',
            ephemeral: true
          });
        }

        const channel = interaction.options.getChannel('channel');
        
        if (!guildConfigs[interaction.guild.id]) {
          return interaction.reply({
            content: '❌ Verification is not set up.',
            ephemeral: true
          });
        }

        const privateChannels = guildConfigs[interaction.guild.id].private_channels || [];
        const index = privateChannels.indexOf(channel.id);
        
        if (index === -1) {
          return interaction.reply({
            content: '❌ This channel is not in the private channels list.',
            ephemeral: true
          });
        }

        privateChannels.splice(index, 1);
        saveConfigs();

        await sendLog(
          `🔓 **Private Channel Removed**\n` +
          `Admin: ${interaction.user.tag}\n` +
          `Channel: ${channel}`,
          interaction.guild
        );

        return interaction.reply({
          content: `✅ Removed ${channel} from private channels.`,
          ephemeral: true
        });
      }

      if (commandName === 'listprivatechannels') {
        const config = guildConfigs[interaction.guild.id];

        if (!config) {
          return interaction.reply({
            content: '❌ Verification is not set up.',
            ephemeral: true
          });
        }

        const privateChannels = config.private_channels || [];

        if (privateChannels.length === 0) {
          return interaction.reply({
            content: 'ℹ️ No private channels configured.',
            ephemeral: true
          });
        }

        const channelsList = privateChannels
          .map(id => {
            const ch = interaction.guild.channels.cache.get(id);
            return ch ? `${ch}` : `<#${id}>`;
          })
          .join('\n');

        const embed = new EmbedBuilder()
          .setColor(0x3498db)
          .setTitle('🔒 Private Channels')
          .setDescription(`These channels are only visible to verified users:\n\n${channelsList}`)
          .setFooter({ text: `${privateChannels.length} channel(s)` });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Owner management commands
      if (commandName === 'addowner') {
        if (!isOwner(interaction.user.id)) {
          return interaction.reply({
            content: '❌ Only bot owners can use this command.',
            ephemeral: true
          });
        }

        const targetUser = interaction.options.getUser('user');

        if (botOwners.includes(targetUser.id)) {
          return interaction.reply({
            content: '❌ This user is already a bot owner.',
            ephemeral: true
          });
        }

        botOwners.push(targetUser.id);
        saveOwners();

        await sendLog(
          `👑 **New Bot Owner Added**\n` +
          `Added by: ${interaction.user.tag}\n` +
          `New owner: ${targetUser.tag} (\`${targetUser.id}\`)`,
          interaction.guild
        );

        return interaction.reply({
          content: `✅ Added ${targetUser.tag} as a bot owner. They can now use owner-only commands.`,
          ephemeral: true
        });
      }

      if (commandName === 'removeowner') {
        if (!isOwner(interaction.user.id)) {
          return interaction.reply({
            content: '❌ Only bot owners can use this command.',
            ephemeral: true
          });
        }

        const targetUser = interaction.options.getUser('user');

        if (!botOwners.includes(targetUser.id)) {
          return interaction.reply({
            content: '❌ This user is not a bot owner.',
            ephemeral: true
          });
        }

        // Prevent removing yourself
        if (targetUser.id === interaction.user.id) {
          return interaction.reply({
            content: '❌ You cannot remove yourself as a bot owner.',
            ephemeral: true
          });
        }

        const index = botOwners.indexOf(targetUser.id);
        botOwners.splice(index, 1);
        saveOwners();

        await sendLog(
          `🚫 **Bot Owner Removed**\n` +
          `Removed by: ${interaction.user.tag}\n` +
          `Removed owner: ${targetUser.tag} (\`${targetUser.id}\`)`,
          interaction.guild
        );

        return interaction.reply({
          content: `✅ Removed ${targetUser.tag} from bot owners.`,
          ephemeral: true
        });
      }

      if (commandName === 'listowners') {
        const ownersList = botOwners
          .map(id => {
            const user = client.users.cache.get(id);
            return user ? `${user.tag} (\`${id}\`)` : `Unknown User (\`${id}\`)`;
          })
          .join('\n');

        const embed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle('👑 Bot Owners')
          .setDescription(ownersList || 'No owners configured')
          .setFooter({ text: `${botOwners.length} owner(s)` });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

    } catch (error) {
      console.error(`Command ${commandName} error:`, error);
      try {
        await interaction.reply({
          content: `❌ Error: ${error.message}`,
          ephemeral: true
        });
      } catch {}
    }
  }
});

// Error handling
client.on(Events.Error, async error => {
  console.error('Bot error:', error);
});

process.on('unhandledRejection', async error => {
  console.error('Unhandled rejection:', error);
});

// Export for Vercel serverless
module.exports = { client, verifyUser, guildConfigs };

// Start the bot (always run in Railway/VPS, skip in Vercel serverless)
if (process.env.VERCEL !== '1') {
  console.log('🚀 Starting bot...');
  client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('Failed to login:', err);
    process.exit(1);
  });
}
