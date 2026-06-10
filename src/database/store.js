import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb() {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    return { commandUsage: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    logger.warn('Failed to parse store.json, resetting.');
    return { commandUsage: {} };
  }
}

function writeDb(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    logger.error('Failed to write store.json:', err.message);
  }
}

export function incrementCommandUsage(commandName) {
  const db = readDb();
  db.commandUsage = db.commandUsage ?? {};
  db.commandUsage[commandName] = (db.commandUsage[commandName] ?? 0) + 1;
  writeDb(db);
}

export function getCommandUsage(commandName) {
  const db = readDb();
  return db.commandUsage?.[commandName] ?? 0;
}

export function getAllStats() {
  return readDb();
}
