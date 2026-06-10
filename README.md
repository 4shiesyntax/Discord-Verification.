<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=5865F2&height=180&section=header&text=Evelyns&fontSize=72&fontColor=ffffff&fontAlignY=36&desc=Discord%20Bot&descAlignY=60&descSize=22&descColor=c9c9ff" width="100%"/>

<br/>

[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-c9c9ff?style=for-the-badge)](LICENSE)
[![Made by](https://img.shields.io/badge/made%20by-lincode.dev-5865F2?style=for-the-badge)](https://lincode.dev)

<br/>

*A production-grade Discord bot — slash commands, dynamic loaders, cooldown system, and clean error handling.*

</div>

<br/>

## ✦ Features

- Slash-command-only architecture — no prefix, no legacy patterns
- Dynamic command and event loaders — drop a file, it just works
- Per-command cooldowns with in-memory tracking
- Centralized user & bot permission validation
- Reusable `EmbedBuilder`, `Logger`, `ErrorHandler`, and `CooldownManager` utilities
- Structured logger with timestamps and color-coded levels
- Graceful error handling at interaction and process level
- Lightweight file-based persistence for usage statistics
- ESLint + Prettier configured out of the box

<br/>

## ✦ Installation

> Requires **Node.js 18** or higher.

```bash
git clone https://github.com/your-username/evelyns.git
cd evelyns
npm install
```

<br/>

## ✦ Setup

**1. Copy the environment file**

```bash
cp .env.example .env
```

**2. Fill in your credentials**

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_guild_id         # optional — omit for global commands
OWNER_ID=your_discord_user_id  # optional — unlocks /stats
```

<br/>

## ✦ Discord Developer Portal Guide

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application**, give it a name, and save
3. Navigate to **Bot** → click **Add Bot** → confirm
4. Under **Token**, click **Reset Token** and copy it into `DISCORD_TOKEN`
5. Enable **Server Members Intent** and **Presence Intent** under Privileged Gateway Intents
6. Go to **OAuth2 → General**, copy your **Client ID** into `CLIENT_ID`
7. Go to **OAuth2 → URL Generator**
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Manage Messages`, `Kick Members`, `Ban Members`
8. Open the generated URL to invite the bot to your server
9. Right-click your server → **Copy Server ID** → paste into `GUILD_ID`

<br/>

## ✦ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DISCORD_TOKEN` | ✅ | Bot token from the Developer Portal |
| `CLIENT_ID` | ✅ | Application (client) ID |
| `GUILD_ID` | ➖ | Guild ID for instant guild-scoped deployment |
| `OWNER_ID` | ➖ | Your Discord user ID — unlocks `/stats` |

<br/>

## ✦ Running the Bot

```bash
# Production
npm start

# Development — auto-restarts on file changes
npm run dev
```

<br/>

## ✦ Deploying Commands

Run once before starting the bot, and again whenever you change a command definition:

```bash
npm run deploy
```

If `GUILD_ID` is set, commands register to that guild instantly. Without it, global commands may take up to an hour to propagate.

<br/>

## ✦ Folder Structure

```
evelyns/
├── data/                        # Auto-created; stores usage stats
├── src/
│   ├── commands/
│   │   ├── developer/
│   │   │   └── stats.js
│   │   ├── moderation/
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   └── purge.js
│   │   └── utility/
│   │       ├── avatar.js
│   │       ├── help.js
│   │       ├── ping.js
│   │       ├── serverinfo.js
│   │       ├── uptime.js
│   │       └── userinfo.js
│   ├── config/
│   │   └── constants.js
│   ├── database/
│   │   └── store.js
│   ├── events/
│   │   ├── client/
│   │   │   ├── interactionCreate.js
│   │   │   └── ready.js
│   │   └── guild/
│   │       ├── guildCreate.js
│   │       └── guildDelete.js
│   ├── handlers/
│   │   ├── commandHandler.js
│   │   └── eventHandler.js
│   ├── utils/
│   │   ├── cooldown.js
│   │   ├── embed.js
│   │   ├── errorHandler.js
│   │   ├── format.js
│   │   ├── logger.js
│   │   └── permissions.js
│   ├── deploy.js
│   └── index.js
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
└── README.md
```

<br/>

## ✦ Adding Commands

1. Create a `.js` file inside the appropriate `src/commands/<category>/` folder
2. Export the required properties:

```js
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('example')
  .setDescription('An example command.');

export const cooldown = 5;
export const category = 'utility';
export const guildOnly = true;       // optional
export const userPermissions = [];   // optional: PermissionFlagsBits values
export const botPermissions = [];    // optional: PermissionFlagsBits values

export async function execute(interaction, client) {
  await interaction.reply({ content: 'Hello!', ephemeral: true });
}
```

3. Run `npm run deploy` to register the command with Discord
4. Restart the bot

<br/>

## ✦ Troubleshooting

**Commands not appearing after deploy**
Confirm `CLIENT_ID` and `GUILD_ID` are correct. If deploying globally, wait up to one hour.

**Bot online but commands fail silently**
Verify your `DISCORD_TOKEN` hasn't been regenerated. Make sure Privileged Gateway Intents are enabled in the portal.

**`Missing Access` or permission errors**
Re-invite the bot using the OAuth2 URL Generator with all required scopes and permissions.

**`Unknown interaction` errors**
The bot didn't respond within the 3-second window. Ensure async commands call `interaction.deferReply()` before any awaited work.

**Node version errors**
Run `node -v` — this project requires Node.js 18 or higher.

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=5865F2&height=100&section=footer" width="100%"/>

made with 💜 by **[lincode.dev](https://lincode.dev)**

</div>