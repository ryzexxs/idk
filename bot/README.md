# Discord Verification Bot (Node.js + Vercel)

A Discord bot that provides secure verification using **Discord OAuth2** authentication, hosted on **Vercel**.

## Features

- 🔐 **Discord OAuth2 Authentication** - Users verify with their actual Discord account
- ✅ `/setup` slash command creates verification message with button
- 🌐 **Hosted on Vercel** - Free, serverless deployment
- 📬 **DM on verification** - Users get a welcome DM when verified
- 🎯 Automatic role assignment after successful OAuth

---

## Quick Setup

### 1. Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Go to **"Bot"** → **"Add Bot"**
4. Copy these values:
   - **Bot Token** → `DISCORD_BOT_TOKEN`
   - **Client ID** → `DISCORD_CLIENT_ID`
   - **Client Secret** → `DISCORD_CLIENT_SECRET`

### 2. Deploy to Vercel

**Option A: Deploy with Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
# Add your environment variables when prompted
```

**Option B: Deploy from GitHub**

1. Push this code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables (see below)
5. Click **Deploy**

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URI=https://your-project.vercel.app/callback
```

### 4. Configure Discord OAuth Redirect

1. Go to https://discord.com/developers/applications/YOUR_CLIENT_ID/oauth2
2. Add redirect URI: `https://your-project.vercel.app/callback`
3. Click **Save**

### 5. Invite Bot to Server

Use this URL (replace `YOUR_CLIENT_ID`):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

Required Bot Permissions:
- **Manage Roles**
- **Send Messages**
- **Manage Messages**
- **Read Message History**

### 6. Set Up Verification in Discord

In your Discord server:

```
/setup
```

This creates a verification message with a button in the current channel.

---

## Usage

### For Server Admins

| Command | Description |
|---------|-------------|
| `/setup` | Create verification message in current channel |
| `/setup role:@Role` | Use a specific role for verification |
| `/setup message:"Custom message"` | Custom verification message |
| `/reset` | Remove verification setup |
| `/config` | Show current configuration |

### For Users

1. Click **"Verify with Discord"** button
2. Click **"Authenticate with Discord"**
3. Authorize the application
4. Get verified automatically + receive a DM!

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# OAUTH_REDIRECT_URI=http://localhost:3000/callback

# Run locally
npm start
```

For local testing, use Vercel CLI:

```bash
vercel dev
```

---

## File Structure

```
bot/
├── api/
│   ├── bot.js          # Main bot logic
│   ├── callback.js     # OAuth callback handler
│   └── index.js        # Home page
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

---

## How It Works

1. User clicks **"Verify with Discord"** button in Discord
2. Bot generates a unique state token and stores it
3. User clicks OAuth link → Discord authorization page
4. User authorizes → Discord redirects to `/callback` with code
5. Vercel function exchanges code for access token
6. Bot fetches user's Discord ID
7. Bot verifies state and assigns verified role
8. User gets a DM and gains server access!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not responding | Check bot is online in Vercel logs |
| OAuth redirect error | Ensure redirect URI matches exactly |
| Can't assign roles | Bot's role must be higher than verified role |
| Commands not showing | Wait for Discord to sync commands |
| "Session expired" | OAuth link expires after 5 minutes - click button again |

---

## Vercel Deployment Notes

- **Free Tier**: Vercel free tier is sufficient for small-medium servers
- **Serverless**: Bot runs on-demand via serverless functions
- **Persistent Storage**: Uses JSON file for configs (upgrade to KV/DB for production)
- **Keep Alive**: Vercel handles scaling automatically

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_BOT_TOKEN` | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | OAuth2 Client Secret |
| `OAUTH_REDIRECT_URI` | Full URL to your Vercel `/callback` endpoint |

---

## License

MIT
