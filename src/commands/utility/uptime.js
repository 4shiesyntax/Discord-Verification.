import { SlashCommandBuilder } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS, EMOJIS } from '../../config/constants.js';
import { formatUptime, formatBytes } from '../../utils/format.js';

export const data = new SlashCommandBuilder()
  .setName('uptime')
  .setDescription('Display bot uptime and system resource usage.');

export const cooldown = 10;
export const category = 'utility';

export async function execute(interaction) {
  const uptimeMs = interaction.client.uptime ?? 0;
  const readyAt = interaction.client.readyAt;
  const mem = process.memoryUsage();

  const fields = [
    { name: `${EMOJIS.CLOCK} Uptime`, value: formatUptime(uptimeMs), inline: true },
    { name: 'Online Since', value: readyAt ? `<t:${Math.floor(readyAt.getTime() / 1000)}:R>` : 'Unknown', inline: true },
    { name: '\u200b', value: '\u200b', inline: true },
    { name: 'Heap Used', value: formatBytes(mem.heapUsed), inline: true },
    { name: 'Heap Total', value: formatBytes(mem.heapTotal), inline: true },
    { name: 'RSS', value: formatBytes(mem.rss), inline: true },
    { name: 'Guilds', value: String(interaction.client.guilds.cache.size), inline: true },
    { name: 'Cached Users', value: String(interaction.client.users.cache.size), inline: true },
    { name: 'WS Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
  ];

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        title: 'Bot Status',
        fields,
        footer: `Node.js ${process.version}`,
        timestamp: true,
      }),
    ],
  });
}
