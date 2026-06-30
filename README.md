<div align="center">
<img src="https://capsule-render.vercel.app/api?type=soft&color=gradient&customColorList=12,20,24&height=220&section=header&text=Lynnnsku&fontSize=76&fontColor=ffffff&fontAlignY=42&desc=elegant%20%E2%9C%A6%20powerful%20%E2%9C%A6%20reliable&descAlignY=68&descSize=18&descColor=f0d6ff&animation=fadeIn" width="100%"/>
</div>

<div align="center">

[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-c9c9ff?style=for-the-badge)](LICENSE)

<br>

![GitHub last commit](https://img.shields.io/github/last-commit/4shiesyntax/discordme_evelyns?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/4shiesyntax/discordme_evelyns?style=for-the-badge)

</div>

<br/>

*A production-grade Discord bot with slash commands, dynamic loaders, cooldown management, and clean error handling.*

</div>

<br/>

## ✦ Features

* Slash command architecture only
* Dynamic command and event loading
* Per-command cooldown tracking
* User and bot permission validation
* Reusable `EmbedBuilder` utility
* Reusable `Logger` utility
* Reusable `ErrorHandler` utility
* Reusable `CooldownManager` utility
* Structured logging with timestamps
* Graceful interaction and process error handling
* Lightweight file-based statistics storage
* ESLint and Prettier configuration included

<br/>

## ✦ Installation

> Requires **Node.js 18** or higher.

```bash
git clone https://github.com/4shiesyntax/discordme_evelyns.git
cd discordme_evelyns
npm install
```

<br/>

## ✦ Setup

### Copy Environment File

```bash
cp .env.example .env
```

### Configure Variables

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_guild_id
OWNER_ID=your_discord_user_id
```

<br/>

## ✦ Discord Developer Portal Guide

1. Visit https://discord.com/developers/applications
2. Create a new application.
3. Open the **Bot** section.
4. Click **Add Bot**.
5. Generate a bot token.
6. Copy the token into `DISCORD_TOKEN`.
7. Enable required privileged intents.
8. Copy the Application ID into `CLIENT_ID`.
9. Generate an OAuth2 invite URL.
10. Invite the bot to your server.
11. Copy your server ID into `GUILD_ID`.

<br/>

## ✦ Environment Variables

| Variable        | Required | Description                             |
| --------------- | -------- | --------------------------------------- |
| `DISCORD_TOKEN` | Yes      | Bot token from the Developer Portal     |
| `CLIENT_ID`     | Yes      | Discord application ID                  |
| `GUILD_ID`      | No       | Guild ID for instant command deployment |
| `OWNER_ID`      | No       | Your Discord user ID. Enables `/stats`  |

<br/>

## ✦ Running The Bot

```bash
npm start
```

Development mode:

```bash
npm run dev
```

<br/>

## ✦ Deploy Commands

Run before starting the bot and whenever command definitions change.

```bash
npm run deploy
```

If `GUILD_ID` is configured, commands are deployed instantly to that guild.

Without `GUILD_ID`, commands are deployed globally and may take up to one hour to appear.

<br/>

## ✦ Folder Structure

```text
discordme_evelyns/
├── data/
├── src/
│   ├── commands/
│   │   ├── developer/
│   │   ├── moderation/
│   │   └── utility/
│   ├── config/
│   ├── database/
│   ├── events/
│   ├── handlers/
│   ├── utils/
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

## ✦ Available Commands

### Utility

* `/ping`
* `/help`
* `/userinfo`
* `/serverinfo`
* `/avatar`
* `/uptime`

### Moderation

* `/ban`
* `/kick`
* `/purge`

### Developer

* `/stats`

<br/>

## ✦ Adding Commands

Create a file inside:

```text
src/commands/<category>/
```

Example:

```js
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('example')
  .setDescription('Example command');

export const cooldown = 5;
export const category = 'utility';

export async function execute(interaction) {
  await interaction.reply('Hello World');
}
```

Deploy commands:

```bash
npm run deploy
```

Restart the bot after deployment.

<br/>

## ✦ Troubleshooting

### Commands Not Appearing

* Verify `CLIENT_ID`
* Verify `GUILD_ID`
* Run `npm run deploy`
* Wait for global deployment propagation

### Bot Online But Commands Fail

* Verify `DISCORD_TOKEN`
* Verify privileged intents
* Check console logs

### Permission Errors

* Verify bot permissions
* Verify channel permissions
* Reinvite the bot if required

### Unknown Interaction

Use:

```js
await interaction.deferReply();
```

for commands that require additional processing time.

### Node.js Errors

```bash
node -v
```

Node.js 18 or higher is required.

<br/>

## ✦ Tech Stack

* Discord.js v14
* Node.js
* JavaScript ES Modules
* ESLint
* Prettier

<br/>

## ✦ License

MIT License

<br/>

## ✦ Author

<div align="center">

<h3>Dika Yugi Pratama</h3 >

<p>
Building modern software, scalable Discord systems,
and meaningful digital experiences.
</p>

<br>

<a href="https://lincode.dev">
  <img src="https://cdn.simpleicons.org/googlechrome/ffffff" width="22">
</a>
&nbsp;&nbsp;

<a href="https://instagram.com/lincodedev">
  <img src="https://cdn.simpleicons.org/instagram/E4405F" width="22">
</a>
&nbsp;&nbsp;

<a href="https://github.com/4shiesyntax">
  <img src="https://cdn.simpleicons.org/github/ffffff" width="22">
</a>
