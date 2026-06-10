import { PermissionsBitField } from 'discord.js';

export function hasPermissions(member, permissions) {
  if (!permissions || permissions.length === 0) return true;
  return member.permissions.has(permissions);
}

export function botHasPermissions(guild, permissions) {
  const botMember = guild.members.me;
  if (!botMember) return false;
  return botMember.permissions.has(permissions);
}

export function formatPermissions(permissions) {
  return permissions
    .map((perm) => {
      const key = Object.keys(PermissionsBitField.Flags).find(
        (k) => PermissionsBitField.Flags[k] === perm
      );
      return key
        ? key.replace(/([A-Z])/g, ' $1').trim()
        : String(perm);
    })
    .join(', ');
}
