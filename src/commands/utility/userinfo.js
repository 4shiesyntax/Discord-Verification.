import { SlashCommandBuilder } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS } from '../../config/constants.js';

const FLAGS_LABELS = {
  ActiveDeveloper: 'Active Developer',
  BugHunterLevel1: 'Bug Hunter',
  BugHunterLevel2: 'Bug Hunter Level 2',
  CertifiedModerator: 'Certified Moderator',
  HypeSquadOnlineHouse1: 'HypeSquad Bravery',
  HypeSquadOnlineHouse2: 'HypeSquad Brilliance',
  HypeSquadOnlineHouse3: 'HypeSquad Balance',
  Hypesquad: 'HypeSquad Events',
  Partner: 'Partnered Server Owner',
  PremiumEarlySupporter: 'Early Supporter',
  Staff: 'Discord Staff',
  VerifiedBot: 'Verified Bot',
  VerifiedDeveloper: 'Early Verified Bot Developer',
};

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Display information about a user.')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to look up (defaults to yourself).').setRequired(false)
  );

export const cooldown = 5;
export const category = 'utility';
export const guildOnly = true;

export async function execute(interaction) {
  const target = interaction.options.getUser('user') ?? interaction.user;
  const member = await interaction.guild.members.fetch(target.id).catch(() => null);

  const createdAt = `<t:${Math.floor(target.createdTimestamp / 1000)}:D>`;
  const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Unknown';

  const rawFlags = target.flags?.toArray() ?? [];
  const badges = rawFlags.map((f) => FLAGS_LABELS[f] ?? f).join(', ') || 'None';

  const roles =
    member?.roles.cache
      .filter((r) => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => `${r}`)
      .slice(0, 10)
      .join(' ') || 'None';

  const tooManyRoles =
    member && member.roles.cache.size - 1 > 10
      ? ` (+${member.roles.cache.size - 1 - 10} more)`
      : '';

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: member?.displayColor || COLORS.PRIMARY,
        author: { name: `${target.tag}`, iconURL: target.displayAvatarURL() },
        thumbnail: target.displayAvatarURL({ size: 256 }),
        fields: [
          { name: 'ID', value: target.id, inline: true },
          { name: 'Account Created', value: createdAt, inline: true },
          { name: 'Joined Server', value: joinedAt, inline: true },
          { name: 'Nickname', value: member?.nickname ?? 'None', inline: true },
          { name: 'Bot', value: target.bot ? 'Yes' : 'No', inline: true },
          { name: 'Badges', value: badges, inline: true },
          { name: `Roles (${member ? member.roles.cache.size - 1 : 0})`, value: `${roles}${tooManyRoles}`, inline: false },
        ],
        timestamp: true,
      }),
    ],
  });
}
