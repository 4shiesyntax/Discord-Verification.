import { SlashCommandBuilder } from 'discord.js';
import { buildEmbed } from '../../utils/embed.js';
import { COLORS } from '../../config/constants.js';
import { capitalize } from '../../utils/format.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Browse all available commands.')
  .addStringOption((option) =>
    option
      .setName('command')
      .setDescription('Get detailed info about a specific command.')
      .setRequired(false)
  );

export const cooldown = 5;
export const category = 'utility';

export async function execute(interaction, client) {
  const commandName = interaction.options.getString('command');

  if (commandName) {
    const command = client.commands.get(commandName.toLowerCase());

    if (!command) {
      await interaction.reply({
        embeds: [
          buildEmbed({
            color: COLORS.ERROR,
            title: 'Command Not Found',
            description: `No command named \`${commandName}\` exists. Use \`/help\` to see all commands.`,
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    const fields = [
      { name: 'Category', value: capitalize(command.category ?? 'unknown'), inline: true },
      { name: 'Cooldown', value: `${command.cooldown ?? 3}s`, inline: true },
    ];

    if (command.userPermissions?.length) {
      fields.push({ name: 'Required Permissions', value: command.userPermissions.join(', '), inline: false });
    }

    await interaction.reply({
      embeds: [
        buildEmbed({
          color: COLORS.PRIMARY,
          title: `/${command.data.name}`,
          description: command.data.description,
          fields,
        }),
      ],
      ephemeral: true,
    });

    return;
  }

  const categorized = new Map();

  for (const command of client.commands.values()) {
    const cat = command.category ?? 'uncategorized';
    if (!categorized.has(cat)) categorized.set(cat, []);
    categorized.get(cat).push(`\`/${command.data.name}\` — ${command.data.description}`);
  }

  const fields = [];
  for (const [cat, cmds] of categorized) {
    fields.push({
      name: `${capitalize(cat)} (${cmds.length})`,
      value: cmds.join('\n'),
      inline: false,
    });
  }

  await interaction.reply({
    embeds: [
      buildEmbed({
        color: COLORS.PRIMARY,
        title: 'Command Directory',
        description: `Use \`/help command:<name>\` for detailed info on a specific command.\n\u200b`,
        fields,
        footer: `${client.commands.size} command(s) available`,
        timestamp: true,
      }),
    ],
    ephemeral: true,
  });
}
