import { Events } from 'discord.js';
import { logger } from '../../utils/logger.js';

export const name = Events.GuildCreate;
export const once = false;

export function execute(guild) {
  logger.info(`Joined new guild: ${guild.name} (${guild.id}) — ${guild.memberCount} members.`);
}
