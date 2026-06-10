import { Events } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { checkCooldown } from '../../utils/cooldown.js';
import { hasPermissions, botHasPermissions } from '../../utils/permissions.js';
import { warnEmbed, errorEmbed } from '../../utils/embed.js';
import { incrementCommandUsage } from '../../database/store.js';
import { DEFAULT_COOLDOWN } from '../../config/constants.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction, client) {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`Unknown command received: /${interaction.commandName}`);
    return;
  }

  if (command.guildOnly && !interaction.guild) {
    await interaction.reply({
      embeds: [errorEmbed('This command can only be used inside a server.')],
      ephemeral: true,
    });
    return;
  }

  if (command.userPermissions?.length && interaction.guild) {
    const member = interaction.member;
    if (!hasPermissions(member, command.userPermissions)) {
      await interaction.reply({
        embeds: [errorEmbed('You do not have permission to use this command.')],
        ephemeral: true,
      });
      return;
    }
  }

  if (command.botPermissions?.length && interaction.guild) {
    if (!botHasPermissions(interaction.guild, command.botPermissions)) {
      await interaction.reply({
        embeds: [errorEmbed('I am missing permissions required to run this command.')],
        ephemeral: true,
      });
      return;
    }
  }

  const cooldownSeconds = command.cooldown ?? DEFAULT_COOLDOWN;
  const cooldownResult = checkCooldown(command.data.name, interaction.user.id, cooldownSeconds);

  if (cooldownResult.onCooldown) {
    await interaction.reply({
      embeds: [warnEmbed(`Please wait **${cooldownResult.remaining}s** before using this command again.`, 'Slow Down')],
      ephemeral: true,
    });
    return;
  }

  try {
    logger.debug(`/${interaction.commandName} used by ${interaction.user.tag} in guild ${interaction.guild?.name ?? 'DM'}`);
    incrementCommandUsage(interaction.commandName);
    await command.execute(interaction, client);
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
}
