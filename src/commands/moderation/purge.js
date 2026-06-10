import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Bulk-delete messages from the current channel.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName('amount')
      .setDescription('Number of messages to delete (1–100).')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
  )
  .addUserOption((option) =>
    option.setName('user').setDescription('Only delete messages from this user.').setRequired(false)
  );

export const cooldown = 5;
export const category = 'moderation';
export const guildOnly = true;
export const userPermissions = [PermissionFlagsBits.ManageMessages];
export const botPermissions = [PermissionFlagsBits.ManageMessages];

export async function execute(interaction) {
  const amount = interaction.options.getInteger('amount');
  const filterUser = interaction.options.getUser('user');

  await interaction.deferReply({ ephemeral: true });

  const fetched = await interaction.channel.messages.fetch({ limit: 100 });
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

  let eligible = fetched.filter((m) => m.createdTimestamp > twoWeeksAgo);

  if (filterUser) {
    eligible = eligible.filter((m) => m.author.id === filterUser.id);
  }

  const toDelete = eligible.first(amount);

  if (toDelete.length === 0) {
    await interaction.editReply({ embeds: [errorEmbed('No eligible messages found. Messages older than 14 days cannot be bulk-deleted.')] });
    return;
  }

  const deleted = await interaction.channel.bulkDelete(toDelete, true);

  await interaction.editReply({
    embeds: [successEmbed(`Deleted **${deleted.size}** message(s)${filterUser ? ` from **${filterUser.tag}**` : ''}.`, 'Messages Purged')],
  });
}
