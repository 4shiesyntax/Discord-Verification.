import { SlashCommandBuilder } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS, EMOJIS } from '../../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the bot latency and API response time.');

export const cooldown = 5;
export const category = 'utility';

export async function execute(interaction) {
  const sent = await interaction.reply({
    embeds: [buildEmbed({ color: COLORS.INFO, description: `${EMOJIS.LOADING} Measuring latency...` })],
    fetchReply: true,
  });

  const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
  const wsLatency = interaction.client.ws.ping;

  await interaction.editReply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        title: `${EMOJIS.PING} Pong!`,
        fields: [
          { name: 'Roundtrip', value: `${roundtrip}ms`, inline: true },
          { name: 'WebSocket', value: `${wsLatency}ms`, inline: true },
        ],
        timestamp: true,
      }),
    ],
  });
}
