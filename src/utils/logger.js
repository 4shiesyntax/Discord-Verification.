const LEVELS = {
  DEBUG: { label: 'DEBUG', color: '\x1b[36m' },
  INFO: { label: 'INFO ', color: '\x1b[32m' },
  WARN: { label: 'WARN ', color: '\x1b[33m' },
  ERROR: { label: 'ERROR', color: '\x1b[31m' },
};

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 23);
}

function write(level, message, ...args) {
  const { label, color } = LEVELS[level];
  const ts = `${DIM}${timestamp()}${RESET}`;
  const lvl = `${color}${label}${RESET}`;
  const extra = args.length ? ' ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ') : '';
  console.log(`${ts} ${lvl} ${message}${extra}`);
}

export const logger = {
  debug: (msg, ...args) => write('DEBUG', msg, ...args),
  info: (msg, ...args) => write('INFO', msg, ...args),
  warn: (msg, ...args) => write('WARN', msg, ...args),
  error: (msg, ...args) => write('ERROR', msg, ...args),
};
