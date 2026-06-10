import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS } from '../../config/constants.js';
import { getAllStats } from '../../database/store.js';
import { formatUptime, formatBytes } from '../../utils/format.js';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View detailed bot statistics (developer only).')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const cooldown = 10;
export const category = 'developer';
export const guildOnly = true;

export async function execute(interaction) {
  if (!process.env.OWNER_ID || interaction.user.id !== process.env.OWNER_ID) {
    await interaction.reply({
      embeds: [buildEmbed({ color: COLORS.ERROR, description: 'This command is restricted to the bot owner.' })],
      ephemeral: true,
    });
    return;
  }

  const db = getAllStats();
  const mem = process.memoryUsage();
  const uptimeMs = interaction.client.uptime ?? 0;

  const usageEntries = Object.entries(db.commandUsage ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const usageText = usageEntries.length
    ? usageEntries.map(([cmd, count]) => `\`/${cmd}\` — ${count} uses`).join('\n')
    : 'No usage data yet.';

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        title: 'Bot Developer Stats',
        fields: [
          { name: 'Uptime', value: formatUptime(uptimeMs), inline: true },
          { name: 'Guilds', value: String(interaction.client.guilds.cache.size), inline: true },
          { name: 'Cached Users', value: String(interaction.client.users.cache.size), inline: true },
          { name: 'Heap Used', value: formatBytes(mem.heapUsed), inline: true },
          { name: 'Heap Total', value: formatBytes(mem.heapTotal), inline: true },
          { name: 'RSS', value: formatBytes(mem.rss), inline: true },
          { name: 'Commands Loaded', value: String(interaction.client.commands.size), inline: true },
          { name: 'WS Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
          { name: 'Node.js', value: process.version, inline: true },
          { name: 'Top Commands', value: usageText, inline: false },
        ],
        timestamp: true,
      }),
    ],
    ephemeral: true,
  });
}
