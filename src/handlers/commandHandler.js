import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Collection } from 'discord.js';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '../commands');
  const categories = fs.readdirSync(commandsPath);

  let loaded = 0;
  let failed = 0;

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const stat = fs.statSync(categoryPath);

    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const command = await import(filePath);

        if (!command.data || !command.execute) {
          logger.warn(`Skipping ${file}: missing 'data' or 'execute' export.`);
          failed++;
          continue;
        }

        client.commands.set(command.data.name, command);
        loaded++;
      } catch (err) {
        logger.error(`Failed to load command ${file}:`, err.message);
        failed++;
      }
    }
  }

  logger.info(`Commands loaded: ${loaded} succeeded, ${failed} failed.`);
}
