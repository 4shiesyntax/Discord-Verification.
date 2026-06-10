import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((option) =>
    option.setName('user').setDescription('The member to kick.').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the kick.').setRequired(false).setMaxLength(512)
  );

export const cooldown = 5;
export const category = 'moderation';
export const guildOnly = true;
export const userPermissions = [PermissionFlagsBits.KickMembers];
export const botPermissions = [PermissionFlagsBits.KickMembers];

export async function execute(interaction) {
  const target = interaction.options.getMember('user');
  const reason = interaction.options.getString('reason') ?? 'No reason provided.';

  if (!target) {
    await interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    return;
  }

  if (!target.kickable) {
    await interaction.reply({ embeds: [errorEmbed("I cannot kick that member. They may have a higher role than me.")], ephemeral: true });
    return;
  }

  if (target.id === interaction.user.id) {
    await interaction.reply({ embeds: [errorEmbed('You cannot kick yourself.')], ephemeral: true });
    return;
  }

  if (interaction.guild.members.me.roles.highest.position <= target.roles.highest.position) {
    await interaction.reply({ embeds: [errorEmbed('That member has a role equal to or higher than mine.')], ephemeral: true });
    return;
  }

  await target.kick(reason);

  await interaction.reply({
    embeds: [
      successEmbed(
        `**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`,
        'Member Kicked'
      ),
    ],
  });
}
