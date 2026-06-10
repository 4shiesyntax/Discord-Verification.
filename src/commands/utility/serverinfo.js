import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS } from '../../config/constants.js';

const VERIFICATION_LEVELS = {
  0: 'None',
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Very High',
};

const NSFW_LEVELS = {
  0: 'Default',
  1: 'Explicit',
  2: 'Safe',
  3: 'Age Restricted',
};

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Display information about this server.');

export const cooldown = 5;
export const category = 'utility';
export const guildOnly = true;

export async function execute(interaction) {
  const guild = interaction.guild;
  await guild.fetch();

  const owner = await guild.fetchOwner().catch(() => null);

  const textChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
  const voiceChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
  const categories = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;

  const onlineMembers = guild.members.cache.filter((m) => m.presence?.status !== 'offline').size;

  const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;
  const boostLevel = guild.premiumTier;
  const boostCount = guild.premiumSubscriptionCount ?? 0;

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        author: { name: guild.name, iconURL: guild.iconURL() ?? undefined },
        thumbnail: guild.iconURL({ size: 256 }) ?? undefined,
        image: guild.bannerURL({ size: 1024 }) ?? undefined,
        fields: [
          { name: 'Owner', value: owner ? `${owner.user.tag}` : 'Unknown', inline: true },
          { name: 'Created', value: createdAt, inline: true },
          { name: 'ID', value: guild.id, inline: true },
          { name: 'Members', value: `Total: ${guild.memberCount}\nOnline: ${onlineMembers}`, inline: true },
          { name: 'Channels', value: `Text: ${textChannels}\nVoice: ${voiceChannels}\nCategories: ${categories}`, inline: true },
          { name: 'Roles', value: String(guild.roles.cache.size), inline: true },
          { name: 'Boosts', value: `Level ${boostLevel} (${boostCount} boosts)`, inline: true },
          { name: 'Verification', value: VERIFICATION_LEVELS[guild.verificationLevel] ?? 'Unknown', inline: true },
          { name: 'NSFW Level', value: NSFW_LEVELS[guild.nsfwLevel] ?? 'Unknown', inline: true },
        ],
        footer: `${guild.memberCount} total members`,
        timestamp: true,
      }),
    ],
  });
}
