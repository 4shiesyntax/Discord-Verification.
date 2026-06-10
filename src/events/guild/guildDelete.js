import { Events } from 'discord.js';
import { logger } from '../../utils/logger.js';

export const name = Events.GuildDelete;
export const once = false;

export function execute(guild) {
  logger.info(`Left guild: ${guild.name} (${guild.id}).`);
}
