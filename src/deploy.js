import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('[DEPLOY] Missing DISCORD_TOKEN or CLIENT_ID in .env');
  process.exit(1);
}

const commandsPath = path.join(__dirname, 'commands');
const categories = fs.readdirSync(commandsPath);
const built = [];

for (const category of categories) {
  const categoryPath = path.join(commandsPath, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;

  const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const mod = await import(path.join(categoryPath, file));
    if (mod.data) {
      built.push(mod.data.toJSON());
      console.log(`[DEPLOY] Queued: ${mod.data.name}`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

if (GUILD_ID) {
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: built });
  console.log(`[DEPLOY] Registered ${built.length} guild command(s) to guild ${GUILD_ID}.`);
} else {
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: built });
  console.log(`[DEPLOY] Registered ${built.length} global command(s).`);
}
