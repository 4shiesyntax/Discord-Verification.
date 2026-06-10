import { logger } from './logger.js';
import { errorEmbed } from './embed.js';

export async function handleInteractionError(interaction, error) {
  logger.error(`Command error in /${interaction.commandName}:`, error.message);

  const embed = errorEmbed('Something went wrong while running that command. Please try again later.');

  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (replyError) {
    logger.error('Failed to send error reply:', replyError.message);
  }
}

export function registerProcessHandlers(client) {
  process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    client.destroy();
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
  });
}
