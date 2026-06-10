import { Events, ActivityType } from 'discord.js';
import { logger } from '../../utils/logger.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
  logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
  logger.info(`Serving ${client.guilds.cache.size} guild(s) with ${client.users.cache.size} cached user(s).`);

  client.user.setActivity(`/help`, { type: ActivityType.Listening });
}
