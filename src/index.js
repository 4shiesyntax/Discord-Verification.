import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { logger } from './utils/logger.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { registerProcessHandlers } from './utils/errorHandler.js';

const requiredEnv = ['DISCORD_TOKEN', 'CLIENT_ID'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    logger.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.GuildMember],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
});

registerProcessHandlers(client);

await loadCommands(client);
await loadEvents(client);

await client.login(process.env.DISCORD_TOKEN);
