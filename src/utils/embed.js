import { EmbedBuilder } from 'discord.js';
import { COLORS } from '../config/constants.js';

export function buildEmbed({ color = COLORS.PRIMARY, title, description, fields = [], footer, thumbnail, image, author, timestamp: addTimestamp = false } = {}) {
  const embed = new EmbedBuilder();

  if (color !== undefined) embed.setColor(color);
  if (title) embed.setTitle(String(title).slice(0, 256));
  if (description) embed.setDescription(String(description).slice(0, 4096));
  if (footer) embed.setFooter({ text: String(footer.text ?? footer).slice(0, 2048), iconURL: footer.iconURL });
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);
  if (author) embed.setAuthor({ name: String(author.name).slice(0, 256), iconURL: author.iconURL, url: author.url });
  if (addTimestamp) embed.setTimestamp();

  if (fields.length) {
    embed.addFields(
      fields.slice(0, 25).map((f) => ({
        name: String(f.name).slice(0, 256),
        value: String(f.value).slice(0, 1024),
        inline: f.inline ?? false,
      }))
    );
  }

  return embed;
}

export function successEmbed(description, title = 'Success') {
  return buildEmbed({ color: COLORS.SUCCESS, title, description });
}

export function errorEmbed(description, title = 'Error') {
  return buildEmbed({ color: COLORS.ERROR, title, description });
}

export function infoEmbed(description, title) {
  return buildEmbed({ color: COLORS.INFO, title, description });
}

export function warnEmbed(description, title = 'Warning') {
  return buildEmbed({ color: COLORS.WARNING, title, description });
}
