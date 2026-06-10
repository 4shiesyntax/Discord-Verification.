import { Collection } from 'discord.js';

const cooldowns = new Collection();

export function checkCooldown(commandName, userId, cooldownSeconds) {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const timestamps = cooldowns.get(commandName);
  const cooldownMs = cooldownSeconds * 1000;
  const now = Date.now();

  if (timestamps.has(userId)) {
    const expiresAt = timestamps.get(userId) + cooldownMs;
    if (now < expiresAt) {
      const remaining = ((expiresAt - now) / 1000).toFixed(1);
      return { onCooldown: true, remaining };
    }
  }

  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownMs);

  return { onCooldown: false, remaining: 0 };
}
