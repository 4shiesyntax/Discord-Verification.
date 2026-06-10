import { SlashCommandBuilder } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS } from '../../config/constants.js';

const IMAGE_SIZES = [128, 256, 512, 1024, 2048, 4096];

export const data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription("Display a user's avatar in full resolution.")
  .addUserOption((option) =>
    option.setName('user').setDescription('The user whose avatar to display (defaults to yourself).').setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('format')
      .setDescription('Image format (default: webp)')
      .setRequired(false)
      .addChoices(
        { name: 'WebP', value: 'webp' },
        { name: 'PNG', value: 'png' },
        { name: 'JPEG', value: 'jpg' },
        { name: 'GIF (animated)', value: 'gif' }
      )
  );

export const cooldown = 5;
export const category = 'utility';

export async function execute(interaction) {
  const target = interaction.options.getUser('user') ?? interaction.user;
  const format = interaction.options.getString('format') ?? 'webp';

  const avatarUrl = target.displayAvatarURL({ size: 1024, extension: format === 'gif' ? undefined : format, forceStatic: format !== 'gif' });

  const links = IMAGE_SIZES.map((size) => {
    const url = target.displayAvatarURL({ size, extension: format === 'gif' ? undefined : format, forceStatic: format !== 'gif' });
    return `[${size}px](${url})`;
  }).join(' · ');

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        title: `${target.username}'s Avatar`,
        image: avatarUrl,
        description: `**Download links:**\n${links}`,
        footer: `Requested by ${interaction.user.tag}`,
        timestamp: true,
      }),
    ],
  });
}
