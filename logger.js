const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logFormat = format.printf(({ timestamp, level, message }) => {
  if (typeof message === 'object') {
    // For JSON messages (traffic logs), stringify nicely
    return `[${timestamp}] ${level.toUpperCase()}: ${JSON.stringify(message)}`;
  }
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const transportConsole = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    logFormat
  )
});

const transportFile = new transports.DailyRotateFile({
  filename: path.join('logs', 'proxy_relay-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    logFormat
  )
});

const transportTrafficFile = new transports.DailyRotateFile({
  filename: path.join('logs', 'traffic-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '50m',
  maxFiles: '30d',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  )
});

const logger = createLogger({
  level: 'debug',
  transports: [
    transportConsole,
    transportFile,
    transportTrafficFile,
  ],
  exitOnError: false,
});

module.exports = logger;