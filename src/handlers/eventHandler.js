import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadEvents(client) {
  const eventsPath = path.join(__dirname, '../events');
  const categories = fs.readdirSync(eventsPath);

  let loaded = 0;
  let failed = 0;

  for (const category of categories) {
    const categoryPath = path.join(eventsPath, category);
    const stat = fs.statSync(categoryPath);

    if (!stat.isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const event = await import(filePath);

        if (!event.name || !event.execute) {
          logger.warn(`Skipping event ${file}: missing 'name' or 'execute' export.`);
          failed++;
          continue;
        }

        const handler = (...args) => event.execute(...args, client);

        if (event.once) {
          client.once(event.name, handler);
        } else {
          client.on(event.name, handler);
        }

        loaded++;
      } catch (err) {
        logger.error(`Failed to load event ${file}:`, err.message);
        failed++;
      }
    }
  }

  logger.info(`Events loaded: ${loaded} succeeded, ${failed} failed.`);
}
