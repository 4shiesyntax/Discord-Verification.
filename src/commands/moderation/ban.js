import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The member to ban.').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the ban.').setRequired(false).setMaxLength(512)
  )
  .addIntegerOption((option) =>
    option
      .setName('delete_messages')
      .setDescription('Number of days of messages to delete (0–7).')
      .setMinValue(0)
      .setMaxValue(7)
      .setRequired(false)
  );

export const cooldown = 5;
export const category = 'moderation';
export const guildOnly = true;
export const userPermissions = [PermissionFlagsBits.BanMembers];
export const botPermissions = [PermissionFlagsBits.BanMembers];

export async function execute(interaction) {
  const target = interaction.options.getMember('user');
  const targetUser = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason') ?? 'No reason provided.';
  const deleteMessageDays = interaction.options.getInteger('delete_messages') ?? 0;

  if (!targetUser) {
    await interaction.reply({ embeds: [errorEmbed('Could not resolve that user.')], ephemeral: true });
    return;
  }

  if (target) {
    if (!target.bannable) {
      await interaction.reply({ embeds: [errorEmbed("I cannot ban that member. They may have a higher role than me.")], ephemeral: true });
      return;
    }

    if (target.id === interaction.user.id) {
      await interaction.reply({ embeds: [errorEmbed('You cannot ban yourself.')], ephemeral: true });
      return;
    }

    if (interaction.guild.members.me.roles.highest.position <= target.roles.highest.position) {
      await interaction.reply({ embeds: [errorEmbed('That member has a role equal to or higher than mine.')], ephemeral: true });
      return;
    }
  }

  await interaction.guild.bans.create(targetUser.id, {
    reason,
    deleteMessageSeconds: deleteMessageDays * 86400,
  });

  await interaction.reply({
    embeds: [
      successEmbed(
        `**${targetUser.tag}** has been banned.\n**Reason:** ${reason}\n**Messages deleted:** ${deleteMessageDays} day(s)`,
        'Member Banned'
      ),
    ],
  });
}
