# Discord Bot

A production-grade Discord bot built with [discord.js v14](https://discord.js.org/), featuring a scalable slash command architecture, dynamic loaders, a cooldown system, permission validation, and clean error handling.

---

## Features

- Slash-command-only architecture (no prefix or message commands)
- Dynamic command and event loaders — drop a file in the right folder, it works
- Per-command cooldowns with in-memory tracking
- Per-command user and bot permission validation
- Centralized embed builder utility
- Structured logger with timestamps and color-coded levels
- Graceful error handling at the interaction and process level
- Lightweight file-based persistence for usage statistics
- ESLint + Prettier configured and ready

---

## Installation

**Requirements:** Node.js 18 or higher

```bash
git clone https://github.com/your-username/discord-bot.git
cd discord-bot
npm install
```

---

## Setup

### 1. Copy the environment file

```bash
cp .env.example .env
```

### 2. Fill in your credentials

Open `.env` and set:

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_guild_id         # optional — omit for global commands
OWNER_ID=your_discord_user_id  # optional — unlocks /stats
```

---

## Discord Developer Portal Guide

1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application**, give it a name, and save.
3. Navigate to **Bot** → click **Add Bot** → confirm.
4. Under **Token**, click **Reset Token**, copy it into `DISCORD_TOKEN` in your `.env`.
5. Enable **Server Members Intent** and **Presence Intent** under **Privileged Gateway Intents**.
6. Navigate to **OAuth2 → General**, copy your **Client ID** into `CLIENT_ID`.
7. Navigate to **OAuth2 → URL Generator**:
   - Scope: `bot`, `applications.commands`
   - Bot permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Manage Messages`, `Kick Members`, `Ban Members`
8. Open the generated URL in your browser to invite the bot to your server.
9. Copy your server's ID (right-click the server → Copy Server ID with Developer Mode on) into `GUILD_ID`.

---

## Environment Variables

| Variable        | Required | Description                                                   |
|-----------------|----------|---------------------------------------------------------------|
| `DISCORD_TOKEN` | Yes      | Bot token from the Discord Developer Portal                   |
| `CLIENT_ID`     | Yes      | Application (client) ID from the Developer Portal            |
| `GUILD_ID`      | No       | Guild ID for guild-scoped command deployment (instant update) |
| `OWNER_ID`      | No       | Your Discord user ID — grants access to `/stats`              |

---

## Running The Bot

```bash
# Production
npm start

# Development (auto-restarts on file changes, Node 18+)
npm run dev
```

---

## Deploying Commands

Run this once before starting the bot, and again any time you add or change a command's definition:

```bash
npm run deploy
```

- If `GUILD_ID` is set, commands register to that guild instantly.
- Without `GUILD_ID`, commands register globally and may take up to an hour to propagate.

---

## Folder Structure

```
discord-bot/
├── data/                        # Auto-created; stores usage stats
├── src/
│   ├── commands/
│   │   ├── developer/           # Owner/developer-only commands
│   │   │   └── stats.js
│   │   ├── moderation/          # Moderation commands
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   └── purge.js
│   │   └── utility/             # General-purpose commands
│   │       ├── avatar.js
│   │       ├── help.js
│   │       ├── ping.js
│   │       ├── serverinfo.js
│   │       ├── uptime.js
│   │       └── userinfo.js
│   ├── config/
│   │   └── constants.js         # Colors, emojis, limits
│   ├── database/
│   │   └── store.js             # File-based key-value store
│   ├── events/
│   │   ├── client/
│   │   │   ├── interactionCreate.js
│   │   │   └── ready.js
│   │   └── guild/
│   │       ├── guildCreate.js
│   │       └── guildDelete.js
│   ├── handlers/
│   │   ├── commandHandler.js    # Dynamic command loader
│   │   └── eventHandler.js      # Dynamic event loader
│   ├── utils/
│   │   ├── cooldown.js          # Per-command cooldown manager
│   │   ├── embed.js             # Reusable EmbedBuilder wrappers
│   │   ├── errorHandler.js      # Interaction + process error handling
│   │   ├── format.js            # Formatters: uptime, bytes, etc.
│   │   ├── logger.js            # Color-coded structured logger
│   │   └── permissions.js       # Permission check helpers
│   ├── deploy.js                # Command deployment script
│   └── index.js                 # Entry point
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
└── README.md
```

---

## Adding Commands

1. Create a `.js` file in the appropriate `src/commands/<category>/` folder.
2. Export the following:

```js
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('example')
  .setDescription('An example command.');

export const cooldown = 5;          // seconds
export const category = 'utility';
export const guildOnly = true;      // optional
export const userPermissions = [];  // optional: PermissionFlagsBits values
export const botPermissions = [];   // optional: PermissionFlagsBits values

export async function execute(interaction, client) {
  await interaction.reply({ content: 'Hello!', ephemeral: true });
}
```

3. Run `npm run deploy` to register the new command with Discord.
4. Restart the bot.

---

## Troubleshooting

**Commands not appearing after deploy**
- Confirm `CLIENT_ID` and `GUILD_ID` in `.env` are correct.
- If deploying globally (no `GUILD_ID`), wait up to one hour.
- Check for errors in the deploy output.

**Bot is online but commands fail silently**
- Verify `DISCORD_TOKEN` is correct and not regenerated since you last copied it.
- Make sure Privileged Gateway Intents (Server Members, Presence) are enabled in the Developer Portal.

**`Missing Access` or permission errors**
- Confirm the bot has the necessary permissions in the channel and server.
- Re-invite the bot using the OAuth2 URL Generator with all required scopes and permissions.

**`Unknown interaction` errors**
- The bot did not respond within the 3-second window. Ensure commands that do async work call `interaction.deferReply()` first.

**Node version errors**
- This project requires Node.js 18 or higher. Run `node -v` to check.
